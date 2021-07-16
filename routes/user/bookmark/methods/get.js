//Importing Controllers
const {
  getBookmarks,
  getSpecificQuestionBookmark,
} = require("../../../../controllers/user");

const get = (router, { isAuthenticated }) => {
  router.get("/getBookmarks/:userId", isAuthenticated, getBookmarks);

  router.get(
    "/getSpecificQuestionBookmark/:userId",
    isAuthenticated,
    getSpecificQuestionBookmark
  );
};

module.exports = get;
