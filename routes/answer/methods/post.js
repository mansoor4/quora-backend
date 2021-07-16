//Importing Controllers
const {
  createAnswer,
  answerImagesUpload,
} = require("../../../controllers/answer");

const post = (router, { isAuthenticated, multerUpload }) => {
  router.post(
    "/createAnswer/:userId/:questionId",
    isAuthenticated,
    createAnswer
  );

  router.post(
    "/answerImagesUpload/:userId/:questionId/:answerId",
    isAuthenticated,
    multerUpload,
    answerImagesUpload
  );
};

module.exports = post;
