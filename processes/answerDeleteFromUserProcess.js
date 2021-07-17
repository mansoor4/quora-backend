//Import Models
const User = require("../database/models/user");

//Import Utils
const error = require("../utils/error");

const answerDeleteFromUserProcess = async ({ data }) => {
  try {
    const { nonPopulatedAnswerOfUser, populatedAnswerOfUser, userId } = data;
    let message = `There is nothing to delete in  user ${userId} answers  `;

    if (populatedAnswerOfUser.length !== nonPopulatedAnswerOfUser.length) {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        throw error("User not found");
      }

      const populatedAnswersIdsOfUser = populatedAnswerOfUser.map(
        (answer) => answer._id
      );

      let { answers } = user;

      answers = populatedAnswersIdsOfUser;

      user.markModified("answers");

      const saveUser = await user.save();
      if (!saveUser) {
        throw error(
          `Answers Not Delete From User ${userId}, Some error occurred`
        );
      }

      message = `Answers Deleted Successfully From User ${userId}`;
    }

    return message;
  } catch (err) {
    throw err;
  }
};

module.exports = answerDeleteFromUserProcess;
