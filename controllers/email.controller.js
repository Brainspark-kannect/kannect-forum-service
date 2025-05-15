const sendmail = require("../utils/email");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");

const sendEmail = async (req, res) => {
  const { to, cc, subject, body } = req.body;

  if (!to) {
    return sendErrorResponse(res, null, "Missing recipients", 400);
  }
  if (!subject) {
    return sendErrorResponse(res, null, "Missing subject", 400);
  }

  // Convert plain text to HTML if it's not already HTML
  const isHTML = /<[a-z][\s\S]*>/i.test(body);
  const htmlBody = isHTML ? body : body.replace(/\n/g, '<br>');
  
  const result = await sendmail(to, cc, subject, htmlBody);

  if (result.success) {
    return sendSuccessResponse(res, null, "Email sent successfully", 200);
  } else {
    return sendErrorResponse(res, result.error, "Failed to send email", 500);
  }
};

module.exports = { sendEmail };