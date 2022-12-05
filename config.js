const config = {
  db: { // Never store any real credential information here.  This is simply for the demo.
    database: process.env.DB_NAME || 'postgres',
    host: process.env.DB_HOST || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || '5432',
    user: process.env.DB_USER || 'postgres',
  }
};

module.exports = config;
