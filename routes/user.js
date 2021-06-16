const express = require("express"),
  router = express.Router();

//Importing Controllers
const {
  getImage,
  createProfile,
  updateProfile,
  getUser,
  createQuestion,
  updateQuestion,
  questionImagesUpload,
  deleteQuestion,
  getQuestion,
  createAnswer,
  updateAnswer,
  answerImagesUpload,
  deleteAnswer,
  getAnswer,
} = require("../controllers/user");

//Importing Middlewares
const multerUpload = require("../middleware/multerUpload"),
  getUserById = require("../middleware/getUserById"),
  getQuestionById = require("../middleware/getQuestionById"),
  getAnswerById = require("../middleware/getAnswerById"),
  isAuthenticated = require("../middleware/isAuthenticated");

//Params Middlewares
router.param("userId", getUserById);
router.param("questionId", getQuestionById);
router.param("answerId", getAnswerById);

//Routers

//POST
router.post(
  "/createProfile/:userId",
  isAuthenticated,
  multerUpload,
  createProfile
);
router.post(
  "/updateProfile/:userId",
  isAuthenticated,
  multerUpload,
  updateProfile
);

router.post("/createQuestion/:userId", isAuthenticated, createQuestion);

router.post(
  "/updateQuestion/:userId/:questionId",
  isAuthenticated,
  updateQuestion
);

router.post(
  "/questionImagesUpload/:userId/:questionId",
  isAuthenticated,
  multerUpload,
  questionImagesUpload
);

router.post("/createAnswer/:userId/:questionId", isAuthenticated, createAnswer);

router.post(
  "/updateAnswer/:userId/:questionId/:answerId",
  isAuthenticated,
  updateAnswer
);

router.post(
  "/answerImagesUpload/:userId/:questionId/:answerId",
  isAuthenticated,
  multerUpload,
  answerImagesUpload
);

//DELETE
router.delete(
  "/deleteQuestion/:userId/:questionId",
  isAuthenticated,
  deleteQuestion
);

router.delete("/deleteAnswer/:userId/:answerId", isAuthenticated, deleteAnswer);

//GET
router.get("/getImage/:imageName", getImage);

router.get("/getUser/:userId", isAuthenticated, getUser);

router.get("/getQuestion/:questionId", isAuthenticated, getQuestion);

router.get("/getAnswer/:answerId", isAuthenticated, getAnswer);

module.exports = router;
