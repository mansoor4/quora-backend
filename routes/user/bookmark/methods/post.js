//Importing Controllers
const { addBookmark } = require("../../../../controllers/user");

const post = (router, { isAuthenticated }) => {
  router.post("/addBookmark/:userId", isAuthenticated, addBookmark);
};

module.exports = post;
