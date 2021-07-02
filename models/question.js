const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: Array,
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upVote: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downVote: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    Views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: Array,
      default: [],
    },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
