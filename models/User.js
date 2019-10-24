const bcrypt = require('bcryptjs');
const usersCollection = require('../db')
  .db()
  .collection('users');
const { isAlphanumeric, isEmail } = require('validator');
const md5 = require('md5');

class User {
  constructor({ _id, name, username, email, password }) {
    this._id = _id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
    this.errors = [];
    this.avatar = this.email ? this.getAvatar() : '';
  }

  /*
  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      if (typeof username != 'string') {
        reject();
        return;
      }

      usersCollection
        .findOne({ username })
        .then(result => {
          if (result) {
            const avatar = new User(result).getAvatar();
            const userDoc = {
              _id: result._id,
              username,
              avatar
            };
            resolve(userDoc);
          } else {
            reject('Invalid username / password.');
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      if (typeof email != 'string') {
        reject();
        return;
      }

      usersCollection
        .findOne({ email })
        .then(result => {
          if (result) {
            resolve(result);
          } else {
            reject('Email not found.');
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
*/

  get data() {
    return {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    };
  }

  cleanUp() {
    if (typeof this.name != 'string') {
      this.name = '';
    }
    if (typeof this.username != 'string') {
      this.username = '';
    }
    if (typeof this.email != 'string') {
      this.email = '';
    }
    if (typeof this.password != 'string') {
      this.password = '';
    }

    this.name = this.name.trim();
    this.username = this.username.trim().toLowerCase();
    this.email = this.email.trim().toLowerCase();
  }

  validate() {
    return new Promise(async (resolve, reject) => {
      const usernameMinLen = 3;
      const usernameMaxLen = 30;
      const pwdMinLen = 6;
      const pwdMaxLen = 50;

      this.errors = [];

      if (!this.username) {
        this.errors.push('You must provide a username.');
      } else if (!isAlphanumeric(this.username)) {
        this.errors.push('Username can only contain letters and numbers.');
      }

      if (this.username && this.username.length < usernameMinLen) {
        this.errors.push(
          `Username must be at least ${usernameMinLen} characters long.`
        );
      }

      if (this.username.length > usernameMaxLen) {
        this.errors.push(
          `Username cannot exceed ${usernameMaxLen} characters.`
        );
      }

      if (!isEmail(this.email)) {
        this.errors.push('You must provide a valid email address.');
      }

      if (!this.password) {
        this.errors.push('You must provide a password.');
      }

      if (this.password && this.password.length < pwdMinLen) {
        this.errors.push(
          `Password must be at least ${pwdMinLen} characters long.`
        );
      }

      if (this.password.length > pwdMaxLen) {
        this.errors.push(`Password cannot exceed ${pwdMaxLen} characters.`);
      }

      if (!this.errors.length) {
        const result = await usersCollection.findOne({
          username: this.username
        });
        if (result)
          this.errors.push(`Username "${this.username}" is already taken.`);
      }

      if (!this.errors.length) {
        const result = await usersCollection.findOne({
          email: this.email
        });
        if (result) this.errors.push(`Email "${this.email}" is already taken.`);
      }

      resolve();
    });
  }

  register() {
    return new Promise(async (resolve, reject) => {
      // Step 1 - validate user data
      this.cleanUp();
      await this.validate();

      // Step 2 - save if no errors
      if (!this.errors.length) {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
        usersCollection
          .insertOne(this.data)
          .then(({ ops }) => {
            this._id = ops[0]._id;
            this.getAvatar();
            resolve(this);
          })
          .catch(err => reject(err));
      } else {
        reject(this.errors);
      }
    });
  }

  login() {
    return new Promise((resolve, reject) => {
      this.cleanUp();
      const searchTerm = this.username
        ? { username: this.username }
        : { email: this.email };
      usersCollection
        .findOne(searchTerm)
        .then(result => {
          if (result && bcrypt.compareSync(this.password, result.password)) {
            Object.keys(result).forEach(key => {
              if (key != 'password') this[key] = result[key];
            });
            this.getAvatar();
            resolve(this);
          } else {
            reject('Invalid username / password.');
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getAvatar() {
    this.avatar = `https://gravatar.com/avatar/${md5(this.email)}?s=128`;
    return this.avatar;
  }
}

module.exports = User;
