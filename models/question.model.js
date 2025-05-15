const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    label: {
      type: [String],
    },
    askedBy: {
      type: String,
      required: true,
    },
    isAnnouncement: {
      type: Boolean,
      default: false,
    },
    fileUrls:[
      {type:String}
    ],
    askedByName: {type: String},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", QuestionSchema);
