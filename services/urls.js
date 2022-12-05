const db = require('./db');
const Util = require('../util');

async function getUrls() {
  const rows = await db.query(
    'SELECT original_url, short_url, load_count FROM url_mappings',
  );
  const data = Util.handleRows(rows);
  return data;
}

async function create(originalUrl, shortUrl) {

}

module.exports = {
  getUrls,
};
