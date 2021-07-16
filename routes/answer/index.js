const express = require("express"),
  router = express.Router();

//Importing Middlewares
const middlewares = {
  multerUpload: require("../../middleware/multerUpload"),
  isAuthenticated: require("../../middleware/isAuthenticated"),
};

//Importing Params Middlewares
const getUserById = require("../../middleware/getUserById"),
  getQuestionById = require("../../middleware/getQuestionById"),
  getAnswerById = require("../../middleware/getAnswerById");

//Importing Answer Methods
const answerGet = require("./methods/get"),
  answerPost = require("./methods/post"),
  answerPut = require("./methods/put"),
  answer_delete = require("./methods/_delete");

//Importing Comment Methods
const commentPost = require("./comment/methods/post"),
  commentPut = require("./comment/methods/put"),
  comment_delete = require("./comment/methods/_delete");

//Importing Vote Methods
const votePut = require("./vote/methods/put");

//Params Middlewares
router.param("userId", getUserById);
router.param("questionId", getQuestionById);
router.param("answerId", getAnswerById);

//Answer Methods
answerGet(router, middlewares);
answerPost(router, middlewares);
answerPut(router, middlewares);
answer_delete(router, middlewares);

//Comment Methods
commentPost(router, middlewares);
commentPut(router, middlewares);
comment_delete(router, middlewares);

//Vote Methods
votePut(router, middlewares);

module.exports = router;
