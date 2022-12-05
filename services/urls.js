const db = require('./db');
const Util = require('../util');

async function getUrls() {
  const rows = await db.query(
    'SELECT original_url, short_url_slug, load_count FROM url_mappings',
  );
  const data = Util.handleRows(rows);
  return data;
}

function validateCreate(originalUrl) {
  const messages = [];

  if (!Util.isAcceptableUrl(originalUrl)) {
    messages.push(`Original URL ${originalUrl} is not an acceptable URL.  Must be well-formed and start with "http://" or "https://".`);
  }

  // Add other validation as needed.

  if (messages.length) {
    const error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
}

async function create(originalUrl, shortUrlSlug) {
  validateCreate(originalUrl);

  const result = await db.query(
    'INSERT INTO url_mappings (original_url, short_url_slug) VALUES ($1, $2) RETURNING *',
    [originalUrl, shortUrlSlug]
  );

  const message = result.length
    ? 'Short URL created successfully'
    : 'Problem creating short URL';
  return message;
}

async function loadByOriginalUrl(originalUrl) {
  const result = await db.query(
    'SELECT original_url FROM url_mappings WHERE original_url = $1',
    [originalUrl]
  );

  const originalUrlResult = result.length ? result[0]['original_url'] : '';
  return originalUrlResult;
}

async function loadByShortUrlSlug(shortUrlSlug) {
  const result = await db.query(
    'UPDATE url_mappings SET load_count = load_count + 1 WHERE short_url_slug = $1 RETURNING original_url',
    [shortUrlSlug]
  );

  const originalUrl = result.length ? result[0]['original_url'] : '';
  return originalUrl;
}

module.exports = {
  getUrls,
  create,
  loadByOriginalUrl,
  loadByShortUrlSlug,
};
