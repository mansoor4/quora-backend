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

module.exports = commentContentSchema;
