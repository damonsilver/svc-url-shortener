const app = require('./app');

require('dotenv').config();

app.listen(process.env.PORT, () => {
  console.log(`Service is listening to port ${process.env.PORT}`);
});
