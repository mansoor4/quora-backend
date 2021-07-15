const mongoose = require("mongoose");

const commentSchema = require("./comment");

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

    views: {
      type: String,
      default: "0",
    },

    comments: [{ type: commentSchema }],

    tags: {
      type: Array,
      default: [],
    },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
