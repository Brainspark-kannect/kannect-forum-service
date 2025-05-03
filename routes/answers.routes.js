const express = require("express");
const router = express.Router();
const { createAnswer, getAnswersByQuestionId, upvoteAnswer, downvoteAnswer } = require("../controllers/answer.controller");
const protect = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware.js");

//post an answer
router.route("/").post(protect,upload.single("file"),createAnswer);

//get all answers for a question
router.route("/:id").get(protect,getAnswersByQuestionId);

// upvote answer
router.route("/:id/upvote").patch(protect,upvoteAnswer);

//downvote answer
router.route("/:id/downvote").patch(protect,downvoteAnswer);

module.exports = router;
