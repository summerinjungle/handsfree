const { OK, CREATED, BAD_REQUEST } = require('../config/statusCode').statusCode;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretKey = process.env.NODE_APP_JWT_SECRET;
require('dotenv')

exports.authCheck = async (req, res, next) => {
  const { token } = req.cookies;
  jwt.verify(token, secretKey, (err, decoded) => {
    if(err) {
      res.status(BAD_REQUEST);
      console.log(err.name);
      next(err);
      return;
    }
    console.log(decoded);
    const user = new User({
      id: decoded.id,
      name: decoded.name,
      email: decoded.email
    })
    req.user = user;
    next();
  });
};

