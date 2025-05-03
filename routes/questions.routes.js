const express = require("express");
const router = express.Router();
const { createQuestion, getQuestions, editQuestion, deleteQuestion, getQuestionById, getQuestionWithAnswers } = require("../controllers/question.controller.js");
const protect = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/upload.middleware.js");

// POST /questions - create question
// GET /questions - list all questions or filter by label
router.route("/").post(protect,upload.single("file"),createQuestion);
router.route("/").get(protect,getQuestions);
router.route("/:id").get(protect,getQuestionById);
router.route("/:id").patch(protect,editQuestion);
router.route("/:id").delete(protect,deleteQuestion);
router.route("/:id/answers").get(protect, getQuestionWithAnswers);
module.exports = router;
