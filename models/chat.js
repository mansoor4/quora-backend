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

const chatSchema = new mongoose.Schema({
  messages: [
    {
      content: { type: chatContentSchema, required: true },

      replyTo: { type: chatContentSchema, default: null },
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);
