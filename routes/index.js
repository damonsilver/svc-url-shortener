const express = require('express');
const router = express.Router();
const title = 'URL Shortener Service';
const { StatusCodes } = require('http-status-codes');
const { isAcceptableUrl, generateShortUrl } = require('../util');
const UrlsService = require('../services/urls');

/* POST shortened URL */
router.post('/', (req, res) => {
  const { url } = req.body;

  if (!isAcceptableUrl(url)) {
    res.status(StatusCodes.BAD_REQUEST);
    res.render('index', {
      title,
      error: `"${url}" is not an acceptable URL.  Must be well-formed and start with "http://" or "https://".`
    });
    return;
  }

  const shortUrl = generateShortUrl(url, req);
  // FIXME:  save shortUrl
  res.render('index',
    {
      title,
      original_url: url,
      short_url: shortUrl,
    },
  );
});

/* Stats page */
router.get('/stats', async (req, res, next) => {
  try {
    const urlMappings = await UrlsService.getUrls();
    res.render('stats', {
      title: `${title} Stats`,
      rows: urlMappings,
    });
  } catch (err) {
    console.error('Error while getting url mapping stats ' + err.message);
    next(err);
  }
});

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title });
});

module.exports = router;
