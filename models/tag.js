const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  tags: {
    type: Array,
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Tag", tagSchema);
