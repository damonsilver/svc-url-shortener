// Once we have a wider variety of utility functions and constants,
// begin to split up utility files by theme.

const { nanoid } = require('nanoid');

const ACCEPTABLE_URL_PROTOCOLS = Object.freeze({
  HTTP: 'http',
  HTTPS: 'https',
});

// This could be configurable instead.
const SHORT_URL_LENGTH = 8;

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
    console.log('err is ', err);
    return false;
  }
  return givenUrl.protocol === `${ACCEPTABLE_URL_PROTOCOLS.HTTP}:` || givenUrl.protocol === `${ACCEPTABLE_URL_PROTOCOLS.HTTPS}:`;
};

const generateShortUrl = (url, req) => {
  const protocol = req.secure ? `${ACCEPTABLE_URL_PROTOCOLS.HTTPS}://` : `${ACCEPTABLE_URL_PROTOCOLS.HTTP}://`;

  // From https://stackoverflow.com/q/39879532
  const proxyHost = req.headers['x-forwarded-host']
  const host = proxyHost ? proxyHost : req.headers.host; // includes port

  const randomId = nanoid(SHORT_URL_LENGTH);

  return protocol + host + '/' + randomId;
};

module.exports = {
  ACCEPTABLE_URL_PROTOCOLS,
  SHORT_URL_LENGTH,
  isEmptyArray,
  handleRows,
  isAcceptableUrl,
  generateShortUrl,
};
