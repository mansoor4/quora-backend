//Importing Controllers
const {
  deleteComment,
  deleteReply,
} = require("../../../../controllers/answer");

const _delete = (router, { isAuthenticated }) => {
  router.delete(
    "/deleteComment/:questionId/:answerId/:commentId",
    isAuthenticated,
    deleteComment
  );

  router.delete(
    "/deleteReply/:questionId/:answerId/:commentId/:replyId",
    isAuthenticated,
    deleteReply
  );
};

module.exports = _delete;
