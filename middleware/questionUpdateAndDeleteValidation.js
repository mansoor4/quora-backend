const error = require("../utils/error"),
  Answer = require("../models/answer");

const questionUpdateAndDeleteValidation = async (req, res, next) => {
  try {
    const question = req.question;
    const { mode } = req.query;
    const message = mode == "update" ? "Updated" : "Deleted";

    const populatedQuestion = await question
      .populate({
        path: "answers",
        model: Answer,
        select: "upVote verified",
      })
      .execPopulate();

    const populatedQuestionAnswers = populatedQuestion.answers;

    const filterAnswer = populatedQuestionAnswers.filter(
      (answer) => answer.upVote || answer.verified
    );

    if (filterAnswer.length) {
      throw error(
        `The Question cannot ${message} because it has answers which are upvoted or verified `
      );
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = questionUpdateAndDeleteValidation;
