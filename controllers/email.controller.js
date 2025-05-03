const sendmail = require("../utils/email");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");

const sendEmail = async (req, res) => {
  const { recipients, cc, subject, body } = req.body;

  if (!recipients) {
    return sendErrorResponse(res, null, "Missing recipients", 400);
  }
  if (!subject) {
    return sendErrorResponse(res, null, "Missing subject", 400);
  }
  const result = await sendmail(recipients, cc, subject, body);

  if (result.success) {
    return sendSuccessResponse(res, null, "Email sent successfully", 200);
  } else {
    return sendErrorResponse(res, result.error, "Failed to send email", 500);
  }
};

module.exports = { sendEmail };