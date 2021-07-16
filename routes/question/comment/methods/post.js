//Importing Controllers
const { addComment, addReply } = require("../../../../controllers/question");

const post = (router, { isAuthenticated }) => {
  router.post("/addComment/:questionId", isAuthenticated, addComment);

  router.post("/addReply/:questionId/:commentId", isAuthenticated, addReply);
};

module.exports = post;
