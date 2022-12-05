const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`Service is listening to port ${config.port}`);
});
