//Importing Controllers
const { updateQuestionVote } = require("../../../../controllers/question");

const put = (router, { isAuthenticated }) => {
  router.put(
    "/updateQuestionVote/:questionId",
    isAuthenticated,
    updateQuestionVote
  );
};

module.exports = put;
