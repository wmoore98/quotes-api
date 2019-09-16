require('dotenv').config();
const mongodb = require('mongodb');

mongodb.connect(
  process.env.CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    module.exports = client;
    const app = require('./app');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  }
);
