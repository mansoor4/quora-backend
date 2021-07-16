//Importing Controllers
const { deleteAnswer } = require("../../../controllers/answer");

const _delete = (router, { isAuthenticated }) => {
  router.delete(
    "/deleteAnswer/:userId/:questionId/:answerId",
    isAuthenticated,
    deleteAnswer
  );
};

module.exports = _delete;
