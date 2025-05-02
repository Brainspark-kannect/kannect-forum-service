const jwt = require('jsonwebtoken');
const { sendErrorResponse } = require('../utils/response.js');

const protect = (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return sendErrorResponse(res, 401, 'Not authorized, token missing');
  }

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET );
    req.user = decoded; // put user data into req
    next();
  } catch (error) {
    return sendErrorResponse(res, 401, 'Not authorized, token invalid');
  }
};

module.exports = protect;
