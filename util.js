// Once we have a wider variety of utility functions and constants,
// begin to split up utility files by theme.

const { nanoid } = require('nanoid');

const ACCEPTABLE_URL_PROTOCOLS = Object.freeze({
  HTTP: 'http',
  HTTPS: 'https',
});

// This could be configurable instead.
const SHORT_URL_SLUG_LENGTH = 8;

const isEmptyArray = (obj) => {
  return Array.isArray(obj) && obj.length === 0;
};

const handleRows = (rows) => {
  if (!rows) {
    return [];
  }

  return rows;
};

const isAcceptableUrl = (url) => {
  let givenUrl;
  try {
    givenUrl = new URL(url);
  } catch (err) {
    console.error('err is ', err);
    return false;
  }
  return givenUrl.protocol === `${ACCEPTABLE_URL_PROTOCOLS.HTTP}:` || givenUrl.protocol === `${ACCEPTABLE_URL_PROTOCOLS.HTTPS}:`;
};

const getProtocol = (req) => {
  return req.secure ? `${ACCEPTABLE_URL_PROTOCOLS.HTTPS}://` : `${ACCEPTABLE_URL_PROTOCOLS.HTTP}://`;
};

const getHostWithPort = (req) => {
  // From https://stackoverflow.com/q/39879532
  const proxyHost = req.headers['x-forwarded-host']
  return host = proxyHost ? proxyHost : req.headers.host; // includes port
};

const generateShortUrlSlug = () => {
  /*
   * The likelihood of collision between generated ID's is very low, 
   * but if this moved beyond the proof-of-concept stage, I'd add a
   * DB lookup during the save that uses this.  As it is, the
   * uniqueness constraint on the column will throw an error.
   */
  return nanoid(SHORT_URL_SLUG_LENGTH);
};

const generateShortUrl = (protocol, host, shortUrlSlug)  => {
  return `${protocol}${host}/${shortUrlSlug}`;
};

module.exports = {
  ACCEPTABLE_URL_PROTOCOLS,
  SHORT_URL_LENGTH: SHORT_URL_SLUG_LENGTH,
  isEmptyArray,
  handleRows,
  isAcceptableUrl,
  getProtocol,
  getHostWithPort,
  generateShortUrlSlug,
  generateShortUrl,
};
