const errorHandler = require('../utils/error');
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log(token)
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY,
    
     
    (err, user) => {
    if (err) {
      return next(errorHandler(403, 'Forbidden'));
    }

    console.log('Decoded user from token:', user);  // Add this line to debug
    req.user = user;  // Ensure req.user is populated with correct data
    next();
  });
};
