const mongoose = require("mongoose");

const commentContentSchema = require("./commentContent");

const commentSchema = new mongoose.Schema(
  {
    replies: [{ type: commentContentSchema }],
  },
  { timestamps: true }
);

commentSchema.add(commentContentSchema);

module.exports = commentSchema;
