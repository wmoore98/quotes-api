const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const client = require('./db');

// const quotes = [
//   {
//     category: 'famous',
//     author: 'Dr. Suess',
//     quote:
//       'You know you’re in love when you can’t fall asleep because reality is finally better than your dreams.'
//   }
// ];

// client
//   .db()
//   .collection('quotes')
//   .insertMany(quotes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN); // update to match the domain you will make the request from - req.headers.origin
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/', async (req, res) => {
  client
    .db()
    .collection('quotes')
    .find()
    .toArray((err, quotes) => {
      res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple Quote API</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">Quote API</h1>
    <p>Instructions on use - GET /api/quotes</p>    
  <script>const quotes = ${JSON.stringify(quotes)}</script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <!-- <script src="/browser.js"></script> -->
</body>
</html>
  `);
    });
});

app.get('/api/quotes', async (req, res) => {
  client
    .db()
    .collection('quotes')
    .find()
    .toArray((err, quotes) => {
      const random = Math.floor(Math.random() * quotes.length);
      res.json(quotes.slice(random, random + 1));
    });
});

const server = require('http').createServer(app);
module.exports = server;
