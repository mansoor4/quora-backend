const express = require("express"),
  router = express.Router();

//Importing Controllers
const {
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  questionImagesUpload,
  updateQuestionVote,
} = require("../controllers/question");

//Importing Middlewares
const multerUpload = require("../middleware/multerUpload"),
  isAuthenticated = require("../middleware/isAuthenticated"),
  questionUpdateAndDeleteValidation = require("../middleware/questionUpdateAndDeleteValidation"),
  getUserById = require("../middleware/getUserById"),
  getQuestionById = require("../middleware/getQuestionById");

//Params Middlewares
router.param("userId", getUserById);
router.param("questionId", getQuestionById);

//Routers

//GET
router.get("/getQuestion/:userId/:questionId", isAuthenticated, getQuestion);

//POST
router.post("/createQuestion/:userId", isAuthenticated, createQuestion);
router.post(
  "/questionImagesUpload/:userId/:questionId",
  isAuthenticated,
  multerUpload,
  questionImagesUpload
);

//PUT
router.put(
  "/updateQuestion/:userId/:questionId",
  isAuthenticated,
  questionUpdateAndDeleteValidation,
  updateQuestion
);

router.put(
  "/updateQuestionVote/:questionId",
  isAuthenticated,
  updateQuestionVote
);

//DELETE
router.delete(
  "/deleteQuestion/:userId/:questionId",
  isAuthenticated,
  questionUpdateAndDeleteValidation,
  deleteQuestion
);

module.exports = router;
