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
  addComment,
  addReply,
  updateComment,
  updateReply,
  deleteComment,
  deleteReply,
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

router.post("/addComment/:questionId", isAuthenticated, addComment);
router.post("/addReply/:questionId/:commentId", isAuthenticated, addReply);

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

router.put(
  "/updateComment/:questionId/:commentId",
  isAuthenticated,
  updateComment
);
router.put(
  "/updateReply/:questionId/:commentId/:replyId",
  isAuthenticated,
  updateReply
);

//DELETE
router.delete(
  "/deleteQuestion/:userId/:questionId",
  isAuthenticated,
  questionUpdateAndDeleteValidation,
  deleteQuestion
);

router.delete(
  "/deleteComment/:questionId/:commentId",
  isAuthenticated,
  deleteComment
);
router.delete(
  "/deleteReply/:questionId/:commentId/:replyId",
  isAuthenticated,
  deleteReply
);

module.exports = router;
