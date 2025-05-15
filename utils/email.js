const nodemailer = require("nodemailer");

const sendmail = async (to, cc, subject, body) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service (e.g., Gmail, Outlook, etc.)
      auth: {
        user: process.env.SMTP_MAIL, // Your email address
        pass: process.env.SMTP_MAIL_PASSWORD, // Your email password or app-specific password
      },
    });

    // Email options
    const mailOptions = {
      from: `"${process.env.COMPANY_NAME}" <${process.env.EMAIL_USER}>`, // Add company name
      to: Array.isArray(to) ? to.join(",") : to, // Handle both string and array
      subject: subject, // Subject line
      html: body, // Email body (HTML format)
    };

    // Only add CC if it exists and is not empty
    if (cc && (Array.isArray(cc) ? cc.length > 0 : cc.trim() !== "")) {
      mailOptions.cc = Array.isArray(cc) ? cc.join(",") : cc;
    }

    // Send email
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email", error };
  }
};

module.exports = sendmail;