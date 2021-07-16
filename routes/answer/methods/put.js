//Importing Controllers
const { updateAnswer } = require("../../../controllers/answer");

const put = (router, { isAuthenticated }) => {
  router.put(
    "/updateAnswer/:userId/:questionId/:answerId",
    isAuthenticated,
    updateAnswer
  );
};

module.exports = put;
