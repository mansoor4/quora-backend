const mongoose = require("mongoose");

const commentSchema = require("./comment");

const answerSchema = new mongoose.Schema(
  {
    body: {
      type: Array,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    upVote: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    downVote: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    comments: [{ type: commentSchema }],

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = answerSchema;
