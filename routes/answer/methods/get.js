//Importing Controllers
const { getAnswer } = require("../../../controllers/answer");

const get = (router, { isAuthenticated }) => {
  router.get("/getAnswer/:userId/:answerId", isAuthenticated, getAnswer);
};

module.exports = get;
