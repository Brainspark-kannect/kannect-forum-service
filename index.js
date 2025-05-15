const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connectDB = require("./config/db.js");
const pool = require("./config/postgress");
const questionRoutes = require("./routes/questions.routes");
const answerRoutes = require("./routes/answers.routes");
const userRoutes = require("./routes/user.routes");
const emailRoutes = require("./routes/email.routes");
const announcementRoutes = require("./routes/announcement.routes");
const { estimatedDocumentCount } = require("./models/question.model.js");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/forum/api/v1/questions", questionRoutes);
app.use("/forum/api/v1/answers", answerRoutes);
app.use("/forum/api/v1/announcements", announcementRoutes);
app.use("/forum/email", emailRoutes);
//just for connecting to postgress
app.use("/forum/api/v1/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
