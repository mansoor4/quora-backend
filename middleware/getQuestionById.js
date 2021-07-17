//Import Models
const Question = require("../database/models/question");

//Import Utils
const error = require("../utils/error");

const getQuestionById = async (req, _, next, id) => {
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
