const express = require('express');
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const json2csv = require('json2csv').parse;
const UrlsService = require('../services/urls');
const {
  generateShortUrl,
  getProtocol,
  getHostWithPort,
  generateShortUrlSlug,
  isEmptyArray
} = require('../util');

const title = 'URL Shortener Service';

/* POST original URL to generate short URL */
router.post('/', async (req, res) => {
  const { url } = req.body;

  const protocol = getProtocol(req);
  const host = getHostWithPort(req);
  const shortUrlSlug = generateShortUrlSlug();
  const shortUrl = generateShortUrl(protocol, host, shortUrlSlug);

  try {
    /*
     * Possible race condition here.  Prefer to wrap find and create
     * in a DB transaction if we moved past PoC phase, but keep it 
     * simple for now.
     */
    const originalUrl = await UrlsService.loadByOriginalUrl(url);
    if (originalUrl) {
      return res.status(StatusCodes.CONFLICT).send('Previously Created');
    }

    const result = await UrlsService.create(url, shortUrlSlug);
    res.render('index',
      {
        title,
        original_url: url,
        short_url: shortUrl,
        message: result,
      });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

const mapShortUrlSlugs = (req, urlMappings) => {
  const protocol = getProtocol(req);
  const host = getHostWithPort(req);

  const mappedUrlMappings = urlMappings.map(x => ({ short_url: generateShortUrl(protocol, host, x.short_url_slug), ...x }))
  mappedUrlMappings.forEach(x => {
    delete x['short_url_slug'];
  });
  return mappedUrlMappings;
};

/* GET stats page */
router.get('/stats', async (req, res, next) => {
  try {
    const urlMappings = await UrlsService.getUrls();
    const mappedUrlMappings = mapShortUrlSlugs(req, urlMappings);
    res.render('stats', {
      title: `${title} Stats`,
      rows: mappedUrlMappings,
    });
  } catch (err) {
    console.error('Error while getting url mapping stats ' + err.message);
    next(err);
  }
});

/* GET stats CSV download */
router.get('/download-stats', async (req, res, next) => {
  try {
    const urlMappings = await UrlsService.getUrls();
    if (isEmptyArray(urlMappings)) {
      return res.status(StatusCodes.NOT_FOUND).send('No stats found');
    }
    const mappedUrlMappings = mapShortUrlSlugs(req, urlMappings);
    const csvString = json2csv(mappedUrlMappings);
    res.setHeader('Content-disposition', 'attachment; filename=stats.csv');
    res.set('Content-Type', 'text/csv');
    res.status(StatusCodes.OK).send(csvString);
  } catch (err) {
    console.error('Error while downloading CSV of url mapping stats ' + err.message);
    next(err);
  }
});

/* GET short URL slug and redirect to original URL, or return 404. */
router.get('/:short_url_slug', async (req, res, next) => {
  const shortUrlSlug = req.params.short_url_slug;
  try {
    const originalUrl = await UrlsService.loadByShortUrlSlug(shortUrlSlug);
    if (originalUrl) {
      return res.redirect(originalUrl);
    }
    return res.status(StatusCodes.NOT_FOUND).send('Short URL not found');
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title });
});

module.exports = router;
