const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory for forwarding to the microservice
const upload = multer({ storage });

module.exports = upload;