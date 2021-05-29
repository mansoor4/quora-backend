const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: Array,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upVote: {
      type: Number,
      default: 0,
    },
    downVote: {
      type: Number,
      default: 0,
    },
    Views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: Array,
    },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
