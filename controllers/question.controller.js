const Question = require("../models/question.model.js");
const Answer = require("../models/answer.model.js");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response.js");
const protect = require("../middlewares/auth.middleware");

// POST /questions - Ask a question
exports.createQuestion = async (req, res) => {
  try {
    const { title, description, label } = req.body;
    const askedBy = req.user.id; // Assuming `req.user` contains the authenticated user's info
    if (!askedBy) {
      return sendErrorResponse(res, "User not found", "Not Found", 404);
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
    const askedByName = `${req.user.first_name} ${req.user.last_name}`;
    const question = new Question({ title, description, askedBy, label,fileUrls, askedByName });
    await question.save();

    return sendSuccessResponse(res, question, "Question posted successfully", 201);
  } catch (error) {
    return sendErrorResponse(res, error, "Failed to post question");
  }
};

// GET /questions - List all questions and also get filtered bases on labels
exports.getQuestions = async (req, res) => {
  try {
    const labels = req.query.label ? (Array.isArray(req.query.label) ? req.query.label : [req.query.label]) : [];

    // filter based upon labels
    const filter = labels.length ? { label: { $all: labels } } : {};

    const questions = await Question.find(filter).sort({ createdAt: -1 });

    if (questions.length == 0) {
      return sendErrorResponse(res, "", "no matching question found", 404);
    }
    return sendSuccessResponse(res, questions, "Question posted successfully", 201);
  } catch (error) {
    return sendErrorResponse(res, error, "Failed to fetch questions");
  }
};

// PATCH /questions/:id - Edit a question
exports.editQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, label } = req.body;

    // Validate the id
    if (!id || !Question.db.base.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, "Invalid question ID", "Bad Request", 400);
    }

    const question = await Question.findByIdAndUpdate(
      id,
      { title, description, label },
      { new: true }
    );

    if (!question) {
      return sendErrorResponse(res, "Question not found", "Not Found", 404);
    }
    return sendSuccessResponse(res, question, "Question updated successfully", 200);
  } catch (error) {
    return sendErrorResponse(res, error, "Failed to update question");
  }
};


// DELETE /questions/:id - Delete a question 
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the id
    if (!id || !Question.db.base.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, "Invalid question ID", "Bad Request", 400);
    }

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return sendErrorResponse(res, "Question not found", "Not Found", 404);
    }
    return sendSuccessResponse(res, question, "Question deleted successfully", 200);
  } catch (error) {
    return sendErrorResponse(res, error, "Failed to delete question");
  }
};

// GET /questions/:id - Get a question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the id
    if (!id || !Question.db.base.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, "Invalid question ID", "Bad Request", 400);
    }

    const question = await Question.findById(id);
    if (!question) {
      return sendErrorResponse(res, "Question not found", "Not Found", 404);
    }
    return sendSuccessResponse(res, question, "Question posted successfully", 200); 
  }
  catch (error) {
    return sendErrorResponse(res, error, "Failed to fetch question");
  }
}


// GET /questions/:id/answers - Get a question with its answers
exports.getQuestionWithAnswers = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the id
    if (!id || !Question.db.base.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, "Invalid question ID", "Bad Request", 400);
    }

    // Fetch the question
    const question = await Question.findById(id);
    if (!question) {
      return sendErrorResponse(res, "Question not found", "Not Found", 404);
    }

    // Fetch the answers for the question
    const answers = await Answer.find({ questionId: id }).sort({ createdAt: -1 });

    // Combine question and answers
    const response = {
      question,
      answers,
    };
    return sendSuccessResponse(res, response, "Question with answers fetched successfully", 200);
  } catch (error) {
    return sendErrorResponse(res, error, "Failed to fetch question with answers");
  }
};