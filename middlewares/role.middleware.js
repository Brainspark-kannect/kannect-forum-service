const { sendErrorResponse } = require("../utils/response");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return sendErrorResponse(res, "Access denied. Admins only.", "Forbidden", 403);
  }
  next();
};

module.exports = adminOnly;