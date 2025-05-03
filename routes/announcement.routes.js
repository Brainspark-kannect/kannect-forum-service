const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  editAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcement.controller");
const protect = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware.js");

// Create an announcement
router.post("/" , protect, adminOnly,upload.single("file"), createAnnouncement);

// Get all announcements
router.get("/", protect,getAnnouncements)

// Edit an announcement
router.patch("/:id", protect, adminOnly, editAnnouncement);

// Delete an announcement
router.delete("/:id", protect, adminOnly, deleteAnnouncement);

module.exports = router;