const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    profileImage: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      required: true,
    },
  },
  text: {
    type: String,
    required: true,
  },
});
