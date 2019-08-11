const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  bcrypt.hash(password, 12)
  .then(hashedPassword => {
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
    })
    return user.save();
  })
  .then(result => {
    res.status(201).json({message: 'user created', userId: result._id});
  })
  .catch(error => {
    next(error);
  })
}

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({email: email})
  .then(user => {
    if (!user) {
      const error = new Error('Email Does Not Exist');
      error.statusCode = 401;
      throw error;
    }

    loadedUser = user;
    return bcrypt.compare(password, loadedUser.password);
  })
  .then(isEqual => {
    if (!isEqual) {
      const error = new Error('Password Incorrect');
      error.errorStatus = 401;
      throw error;
    }

    const token = jwt.sign({
      email: email,
      userId: loadedUser._id.toString()
    }, 'secretsecret', {
      expiresIn: '1h'
    });

    res.status(200).json({token: token, userId: loadedUser._id.toString()});
  })
  .catch(error => next(error));
}