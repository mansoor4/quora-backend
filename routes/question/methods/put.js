//Importing Controllers
const { updateQuestion } = require("../../../controllers/question");

const put = (
  router,
  { isAuthenticated, questionUpdateAndDeleteValidation }
) => {
  router.put(
    "/updateQuestion/:userId/:questionId",
    isAuthenticated,
    questionUpdateAndDeleteValidation,
    updateQuestion
  );
};

module.exports = put;
