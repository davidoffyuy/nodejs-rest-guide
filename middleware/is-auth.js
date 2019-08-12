const jwt = require('jsonwebtoken');
const jwtSecret = require('../private/jwtSecret');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  console.log(req.get('Authorization'));
  if (!authHeader) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;
  
  try {
    decodedToken = jwt.verify(token, jwtSecret);
  }
  catch (err) {
    throw err;
  }

  if (!decodedToken) {
    const error = new Error('Token cannot be verified');
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
}