const Answer = require("../models/answer"),
  error = require("../utils/error");

const getAnswerById = async (req, res, next, id) => {
  try {
    const answer = await Answer.findOne({ _id: id });
    if (!answer) {
      throw error("Answer not found", 404);
    }
    req.answer = answer;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = getAnswerById;
