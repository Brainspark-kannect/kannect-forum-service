const express = require('express');
const { sendEmail } = require('../controllers/email.controller');

const router = express.Router();

// Route to send email
router.post('/send',sendEmail);

module.exports = router;