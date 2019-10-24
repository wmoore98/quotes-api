const quotesCollection = require('../db')
  .db()
  .collection('quotes');

class Quote {
  constructor({ _id, author, category, quote }) {
    this._id = _id;
    this.author = author;
    this.category = category;
    this.quote = quote;
    this.errors = [];
  }

  static getRandomQuote() {
    return new Promise(async function(resolve, reject) {
      await quotesCollection.find().toArray((err, quotes) => {
        if (err) reject(err);
        const random = Math.floor(Math.random() * quotes.length);
        const result = quotes.slice(random, random + 1);
        resolve(result);
      });
    });
  }
}

module.exports = Quote;
