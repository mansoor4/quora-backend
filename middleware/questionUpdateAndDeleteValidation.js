//Import Models
const Answer = require("../database/models/answer");

//Import Utils
const error = require("../utils/error");

const questionUpdateAndDeleteValidation = async (req, _, next) => {
  try {
    const question = req.question;
    const { mode } = req.query;
    const message = mode == "update" ? "Updated" : "Deleted";

    await question
      .populate({
        path: "answers",
        model: Answer,
        select: "upVote verified",
      })
      .execPopulate();

    const populatedQuestionAnswers = question.answers;

    const filterAnswer = populatedQuestionAnswers.filter(
      (answer) => answer.upVote || answer.verified
    );

    if (filterAnswer.length) {
      throw error(
        `The Question cannot ${message} because it has answers which are upvoted or verified `,
        422
      );
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = questionUpdateAndDeleteValidation;
