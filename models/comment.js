const mongoose = require("mongoose");
const commentContentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  text: {
    type: String,
    required: true,
  },

  likes: {
    type: String,
    default: "0",
  },
});
const commentSchema = new mongoose.Schema(
  {
    replies: [{ type: commentContentSchema }],
  },
  { timestamps: true }
);

commentSchema.add(commentContentSchema);

// module.exports = mongoose.model("Comment", commentSchema);

module.exports = commentSchema;
