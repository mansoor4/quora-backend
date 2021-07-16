const express = require("express"),
  router = express.Router();

//Importing Controllers
const {
  getAnswer,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  answerImagesUpload,
  updateAnswerVote,
  addComment,
  addReply,
  updateComment,
  updateReply,
  deleteComment,
  deleteReply,
} = require("../controllers/answer");

//Importing Middlewares
const multerUpload = require("../middleware/multerUpload"),
  isAuthenticated = require("../middleware/isAuthenticated"),
  getUserById = require("../middleware/getUserById"),
  getQuestionById = require("../middleware/getQuestionById"),
  getAnswerById = require("../middleware/getAnswerById");

//Params Middlewares
router.param("userId", getUserById);
router.param("questionId", getQuestionById);
router.param("answerId", getAnswerById);

//Routers

//GET
router.get("/getAnswer/:userId/:answerId", isAuthenticated, getAnswer);

//POST
router.post("/createAnswer/:userId/:questionId", isAuthenticated, createAnswer);
router.post(
  "/answerImagesUpload/:userId/:questionId/:answerId",
  isAuthenticated,
  multerUpload,
  answerImagesUpload
);

router.post("/addComment/:questionId/:answerId", isAuthenticated, addComment);
router.post(
  "/addReply/:questionId/:answerId/:commentId",
  isAuthenticated,
  addReply
);

//PUT
router.put(
  "/updateAnswer/:userId/:questionId/:answerId",
  isAuthenticated,
  updateAnswer
);
router.put("/updateAnswerVote/:answerId", isAuthenticated, updateAnswerVote);

router.put(
  "/updateComment/:questionId/:answerId/:commentId",
  isAuthenticated,
  updateComment
);
router.put(
  "/updateReply/:questionId/:answerId/:commentId/:replyId",
  isAuthenticated,
  updateReply
);

//DELETE
router.delete(
  "/deleteAnswer/:userId/:questionId/:answerId",
  isAuthenticated,
  deleteAnswer
);

router.delete(
  "/deleteComment/:questionId/:answerId/:commentId",
  isAuthenticated,
  deleteComment
);
router.delete(
  "/deleteReply/:questionId/:answerId/:commentId/:replyId",
  isAuthenticated,
  deleteReply
);

module.exports = router;
