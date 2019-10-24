const apiRouter = require('express').Router();
const userController = require('./controllers/userController');
const quoteController = require('./controllers/quoteController');
// const cors = require('cors');

// apiRouter.use(cors());

apiRouter.post('/login', userController.apiLogin);
apiRouter.post('/register', userController.apiRegister);

apiRouter.get('/quotes', quoteController.apiGetRandomQuote);

module.exports = apiRouter;
