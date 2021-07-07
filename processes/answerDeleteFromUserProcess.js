const error = require("../utils/error");

const answerDeleteFromUserProcess = async ({ data }) => {
  try {
    const { user, nonPopulatedAnswerOfUser } = data;
    let message = `There is nothing to delete in  user ${user._id} answers  `;

    if (user.answers.length !== nonPopulatedAnswerOfUser) {
      const populatedAnswersOfUser = user.answers.map((answer) => answer._id);
      user.answers = populatedAnswersOfUser;
      user.markModified("answers");
      const saveUser = await user.save();
      if (!saveUser) {
        throw error(
          `Answers Not Delete From User ${user._id}, Some error occurred`
        );
      }
      message = `Answers Deleted Successfully From User ${user._id}`;
    }

    return message;
  } catch (err) {
    throw err;
  }
};

module.exports = answerDeleteFromUserProcess;
