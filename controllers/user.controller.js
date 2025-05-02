const jwt = require("jsonwebtoken");
const pool = require("../config/postgress.js");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");


// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database for the user
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = result.rows[0];

    if (!user) {
      return sendErrorResponse(res, "User does not exist", "User does not exist", 400);
    }

    // Check if the password matches
    if (user.password !== password) {
      return sendErrorResponse(res, "Invalid credentials", "Invalid credentials", 401);
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    // Set the token as a cookie
    res.cookie("token", token, { httpOnly: true }); // Secure cookie
    return sendSuccessResponse(res, { user, token }, "Login successful.", 200);
  } catch (error) {
    return sendErrorResponse(res, error.message, "Login failed!", 500);
  }
};