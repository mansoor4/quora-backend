const { updateAnswerVote } = require("../../../../controllers/answer");

const put = (router, { isAuthenticated }) => {
  router.put("/updateAnswerVote/:answerId", isAuthenticated, updateAnswerVote);
};

module.exports = put;
