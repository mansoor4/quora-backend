//Importing Controllers
const { deleteQuestion } = require("../../../controllers/question");

const _delete = (
  router,
  { isAuthenticated, questionUpdateAndDeleteValidation }
) => {
  router.delete(
    "/deleteQuestion/:userId/:questionId",
    isAuthenticated,
    questionUpdateAndDeleteValidation,
    deleteQuestion
  );
};

module.exports = _delete;
