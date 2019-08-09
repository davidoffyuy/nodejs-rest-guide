const bcrypt = require('bcrypt');
const User = require('../models/user');
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