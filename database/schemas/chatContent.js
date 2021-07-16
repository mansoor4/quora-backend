const mongoose = require("mongoose");

const chatContentSchema = new mongoose.Schema({
  contentItem: {
    type: "String",
    required: true,
  },

  status: {
    type: "String",
    enum: ["sending", "send", "seen"],
    default: "sending",
  },
});

module.exports = chatContentSchema;
