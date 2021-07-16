//Importing Controllers
const { addComment, addReply } = require("../../../../controllers/answer");

const post = (router, { isAuthenticated }) => {
  router.post("/addComment/:questionId/:answerId", isAuthenticated, addComment);

  router.post(
    "/addReply/:questionId/:answerId/:commentId",
    isAuthenticated,
    addReply
  );
};

module.exports = post;
