//Importing Controllers
const { getQuestion } = require("../../../controllers/question");

const get = (router, { isAuthenticated }) => {
  router.get("/getQuestion/:userId/:questionId", isAuthenticated, getQuestion);
};

module.exports = get;
