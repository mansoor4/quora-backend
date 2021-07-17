//Import Models
const Answer = require("../database/models/answer");

//Import Utils
const error = require("../utils/error");

const getAnswerById = async (req, _, next, id) => {
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
