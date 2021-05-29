const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    body: {
      type: Array,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Answer", answerSchema);
