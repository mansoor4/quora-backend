const mongoose = require("mongoose");

const answerSchema = require("../schemas/answer");

module.exports = mongoose.model("Answer", answerSchema);
