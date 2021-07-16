//Importing Controllers
const {
  updateComment,
  updateReply,
} = require("../../../../controllers/answer");

const put = (router, { isAuthenticated }) => {
  router.put(
    "/updateComment/:questionId/:answerId/:commentId",
    isAuthenticated,
    updateComment
  );

  router.put(
    "/updateReply/:questionId/:answerId/:commentId/:replyId",
    isAuthenticated,
    updateReply
  );
};

module.exports = put;
