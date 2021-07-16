const mongoose = require("mongoose");

const chatContentSchema = require("./chatContent");

const chatSchema = new mongoose.Schema({
  messages: [
    {
      content: { type: chatContentSchema, required: true },

      replyTo: { type: chatContentSchema, default: null },
    },
  ],
});

module.exports = chatSchema;
