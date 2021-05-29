const Question = require("../models/question"),
  error = require("../utils/error");

const getQuestionById = async (req, res, next, id) => {
  try {
    const question = await Question.findOne({ _id: id });
    if (!question) {
      throw error("Question not found", 404);
    }
    req.question = question;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = getQuestionById;
