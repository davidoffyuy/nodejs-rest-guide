const User = require('../models/user');

exports.getStatus = (req, res, next) => {
  User.findById(req.userId)
  .then(user => {
    if (!user) {
      const error = new Error('User not found');
      throw error;
    }
    res.status(200).json({status: user.status});
  })
  .catch(err => next(err));
}

exports.editStatus = (req, res, next) => {
  const newStatus = req.body.status;
  console.log(req.body.status);

  User.findById(req.userId)
  .then(user => {
    if (!user) {
      const error = new Error('User not found');
      throw error;
    }
    user.status = newStatus;
    return user.save();
  })
  .then(user => {
    res.status(200).json({status: 'status updated', name: user.name})
  })
  .catch(err => next(err));
}