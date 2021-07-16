//Importing Controllers
const {
  createQuestion,
  questionImagesUpload,
} = require("../../../controllers/question");

const post = (router, { isAuthenticated, multerUpload }) => {
  router.post("/createQuestion/:userId", isAuthenticated, createQuestion);

  router.post(
    "/questionImagesUpload/:userId/:questionId",
    isAuthenticated,
    multerUpload,
    questionImagesUpload
  );
};

module.exports = post;
