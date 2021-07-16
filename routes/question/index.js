const express = require("express"),
  router = express.Router();

//Importing Middlewares
const middlewares = {
  multerUpload: require("../../middleware/multerUpload"),
  isAuthenticated: require("../../middleware/isAuthenticated"),
  questionUpdateAndDeleteValidation: require("../../middleware/questionUpdateAndDeleteValidation"),
};

//Importing Params Middlewares
const getUserById = require("../../middleware/getUserById"),
  getQuestionById = require("../../middleware/getQuestionById");

//Importing Question Methods
const questionGet = require("./methods/get"),
  questionPost = require("./methods/post"),
  questionPut = require("./methods/put"),
  question_delete = require("./methods/_delete");

//Importing Comment Methods
const commentPost = require("./comment/methods/post"),
  commentPut = require("./comment/methods/put"),
  comment_delete = require("./comment/methods/_delete");

//Importing Vote Methods
const votePut = require("./vote/methods/put");

//Params Middlewares
router.param("userId", getUserById);
router.param("questionId", getQuestionById);

//Answer Methods
questionGet(router, middlewares);
questionPost(router, middlewares);
questionPut(router, middlewares);
question_delete(router, middlewares);

//Comment Methods
commentPost(router, middlewares);
commentPut(router, middlewares);
comment_delete(router, middlewares);

//Vote Methods
votePut(router, middlewares);

module.exports = router;
