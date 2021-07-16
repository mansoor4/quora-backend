//Importing Controllers
const {
  updateComment,
  updateReply,
} = require("../../../../controllers/question");

const put = (router, { isAuthenticated }) => {
  router.put(
    "/updateComment/:questionId/:commentId",
    isAuthenticated,
    updateComment
  );

  router.put(
    "/updateReply/:questionId/:commentId/:replyId",
    isAuthenticated,
    updateReply
  );
};

module.exports = put;
