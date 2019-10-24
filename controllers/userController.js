const User = require('../models/User');
const jwt = require('jsonwebtoken');

/*
exports.apiMustBeLoggedIn = function (req, res, next) {
  try {
    req.apiUser = jwt.verify(req.body.token, process.env.JWT_SECRET);
    next();
  } catch {
    res.json('Sorry, you must provide a valid token.');
  }
};
*/

// TODO - Consider DRYing up with apiRegister
exports.apiLogin = function(req, res) {
  // altLogin can be username or email
  if (req.body.altLogin) {
    if (/@/.test(req.body.altLogin)) {
      req.body.email = req.body.altLogin;
    } else {
      req.body.username = req.body.altLogin;
    }
  }
  const user = new User(req.body);
  user
    .login()
    .then(response => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      res.json({
        token,
        name: user.name,
        avatar: user.avatar
      });
    })
    .catch(error => {
      res.status(401).json('Invalid user');
    });
};

/*
exports.login = function (req, res) {
  const user = new User(req.body);
  user
    .login()
    .then(response => {
      req.session.user = response;
      req.session.save(() => res.redirect('/'));
    })
    .catch(error => {
      req.flash('errors', error);
      req.session.save(() => res.redirect('/'));
    });
};

exports.logout = function (req, res) {
  req.session.destroy(() => res.redirect('/'));
};
*/

exports.apiRegister = async function(req, res) {
  const user = new User(req.body);
  await user
    .register()
    .then(response => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      res.json({
        token,
        avatar: user.avatar
      });
    })
    .catch(errors => {
      res.status(400).json(errors);
    });
};

/*
exports.register = async function (req, res) {
  const user = new User(req.body);
  await user
    .register()
    .then(response => {
      req.session.user = response;
      req.session.save(() => res.redirect('/'));
    })
    .catch(errors => {
      req.flash('regErrors', errors);
      req.session.save(() => res.redirect('/'));
    });
};
*/

/*
exports.doesUsernameExist = function (req, res) {
  User.findByUsername(req.params.username)
    .then(() => res.json(true))
    .catch(() => res.json(false));
};

exports.doesEmailExist = function (req, res) {
  User.findByEmail(req.params.email)
    .then(() => res.json(true))
    .catch(() => res.json(false));
};
*/
