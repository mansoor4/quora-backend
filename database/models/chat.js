const mongoose = require("mongoose");

const chatSchema = require("../schemas/chat");

module.exports = mongoose.model("Chat", chatSchema);
