const Question = require("../models/question.model.js");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");

// Create an announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;

    const announcement = new Question({
      title,
      description,
      askedBy: req.user.id, // Admin user ID
      isAnnouncement: true,
    });

    await announcement.save();

    return sendSuccessResponse(res, announcement, "Announcement created successfully", 201);
  } catch (error) {
    return sendErrorResponse(res, error, "Failed to create announcement");
  }
};


// Get all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Question.find({ isAnnouncement: true }).sort({ updatedAt: -1 });

    if (!announcements || announcements.length === 0) {
      return sendErrorResponse(res, "No announcements found", "Not Found", 404);
    }

    return sendSuccessResponse(res, announcements, "Announcements fetched successfully");
  } catch (error) {
    return sendErrorResponse(res, error, "Failed to fetch announcements");
  }
};

// Edit an announcement
exports.editAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Validate the id
    if (!id || !Question.db.base.Types.ObjectId.isValid(id)) {
      return sendErrorResponse(res, "Invalid announcement ID", "Bad Request", 400);
    }

    const announcement = await Question.findOneAndUpdate(
      { _id: id, isAnnouncement: true },
      { title, description },
      { new: true }
    );

    if (!announcement) {
      return sendErrorResponse(res, "Announcement not found", "Not Found", 404);
    }

    return sendSuccessResponse(res, announcement, "Announcement updated successfully");
  } catch (error) {
    return sendErrorResponse(res, error, "Failed to update announcement");
  }
};

// Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Question.findOneAndDelete({ _id: id, isAnnouncement: true });

    if (!announcement) {
      return sendErrorResponse(res, "Announcement not found", "Not Found", 404);
    }

    return sendSuccessResponse(res, null, "Announcement deleted successfully");
  } catch (error) {
    return sendErrorResponse(res, error, "Failed to delete announcement");
  }
};