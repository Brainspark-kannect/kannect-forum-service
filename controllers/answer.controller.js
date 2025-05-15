const Answer = require("../models/answer.model");
const Question = require("../models/question.model");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");

// POST /answers - Post an answer
exports.createAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    answeredBy=req.user.id; // Assuming `req.user` contains the authenticated user's info
    if (!answeredBy) {
      return sendErrorResponse(res, "User not found in PostgreSQL", "Not Found", 404);
    }

   // Check if the question is an announcement
    const question = await Question.findById(questionId);
    if (!question) {
      return sendErrorResponse(res, "Question not found", "Not Found", 404);
    }
    if (question.isAnnouncement) {
      return sendErrorResponse(res, "Announcements cannot be answered", "Forbidden", 403);
    }
    let fileUrls = [];
    // Handle file uploads if files are provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const formData = new FormData();
        formData.append("fileName", file.originalname);
        formData.append("file", file.buffer);

        const uploadResponse = await axios.post(
          "http://localhost:8080/masters/file/upload",
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          }
        );

        fileUrls.push(uploadResponse.data); // Assuming the microservice returns the file URL
      }
    }
    const answeredByName = `${req.user.first_name} ${req.user.last_name}`;
    const answer = new Answer({ questionId, content, answeredBy, answeredByName, fileUrls });
    await answer.save();

    sendSuccessResponse(res, answer, "Answer posted successfully", 201);
  } catch (error) {
    sendErrorResponse(res, error, "Failed to post answer");
  }
};

// GET /answers/:id - Get answers to a question
exports.getAnswersByQuestionId = async (req, res) => {
  try {
    const { id } = req.params;
    const answers = await Answer.find({ questionId: id }).sort({ createdAt: -1 }); //we can further sort by upvotes
    if (!answers || answers.length == 0) {
      return sendErrorResponse(res, "no answer found", "no answer found", 404);
    }
    sendSuccessResponse(res, answers);
  } catch (error) {
    sendErrorResponse(res, error, "Failed to fetch answers");
  }
};

// PATCH /answers/:id/upvote - Upvote an answer
exports.upvoteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's info

    if (!userId) {
      return sendErrorResponse(res, "User not found in PostgreSQL", "Not Found", 404);
    }

    const answer = await Answer.findById(id);

    if (!answer) {
      return sendErrorResponse(res, "Answer not found", "Not Found", 404);
    }

    if (answer.upvotedBy.includes(userId)) {
      return sendErrorResponse(res, "You have already upvoted this answer", "Conflict", 409);
    }

    if(answer.downvotedBy.includes(userId)) { 
      return sendErrorResponse(res, "You have already downvoted this answer", "Conflict", 409);
    }
    answer.upvotedBy.push(userId);
    await answer.save();
    sendSuccessResponse(res, answer, "Answer upvoted");
  } catch (error) {
    sendErrorResponse(res, error, "Failed to upvote answer");
  }
};

// PATCH /answers/:id/downvote - Downvote an answer
exports.downvoteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's info

    if (!userId) {
      return sendErrorResponse(res, "User not found in PostgreSQL", "Not Found", 404);
    }

    const answer = await Answer.findById(id);

    if (!answer) {
      return sendErrorResponse(res, "Answer not found", "Not Found", 404);
    }

    // Check if the user has already downvoted
    if (answer.downvotedBy.includes(userId)) {
      return sendErrorResponse(res, "You have already downvoted this answer", "Conflict", 409);
    }

    // Check if the user has already upvoted
    if (answer.upvotedBy.includes(userId)) {
      return sendErrorResponse(res, "You have already upvoted this answer", "Conflict", 409);
    }

    // Add the user to the downvotedBy array
    answer.downvotedBy.push(userId);
    await answer.save();
    sendSuccessResponse(res, answer, "Answer downvoted");
  } catch (error) {
    sendErrorResponse(res, error, "Failed to downvote answer");
  }
};
