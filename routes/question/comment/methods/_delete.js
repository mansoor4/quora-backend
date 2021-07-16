//Importing Controllers
const {
  deleteComment,
  deleteReply,
} = require("../../../../controllers/question");

const _delete = (router, { isAuthenticated }) => {
  router.delete(
    "/deleteComment/:questionId/:commentId",
    isAuthenticated,
    deleteComment
  );

  router.delete(
    "/deleteReply/:questionId/:commentId/:replyId",
    isAuthenticated,
    deleteReply
  );
};

module.exports = _delete;
