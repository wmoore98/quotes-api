const Quote = require('../models/Quote');

exports.apiGetRandomQuote = async (req, res) => {
  try {
    const quote = await Quote.getRandomQuote();
    res.json(quote);
  } catch {
    res.json('Sorry, unable to get a random quote at this time.');
  }
};
