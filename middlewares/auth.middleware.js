const jwt = require('jsonwebtoken');
const { sendErrorResponse } = require('../utils/response.js');
const pool = require('../config/postgress'); // PostgreSQL connection

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return sendErrorResponse(res, 401, 'Not authorized, token missing');
    }

    // Verify JWT using the exact same secret as Spring Boot
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    const username = decoded.sub || decoded.username;
    if (!username) {
      return sendErrorResponse(res, 401, 'Invalid token payload');
    }

    // Fetch user from database using the username
    const userResult = await pool.query(
      `SELECT u.*, 
              json_agg(r.role_name) AS roles
         FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON r.id = ur.role_id
        WHERE u.user_name = $1
     GROUP BY u.id`,
      [username]
    );

    if (userResult.rows.length === 0) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    req.user = userResult.rows[0]; 
    console.log(req.user);// Attach user to request
    next();

  } catch (error) {
    console.error('JWT verification or DB fetch error:', error);
    return sendErrorResponse(res, 401, 'Not authorized, token invalid');
  }
};

module.exports = protect;
