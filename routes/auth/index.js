const express = require("express"),
  router = express.Router();

//Importing Middlewares
const middlewares = {
  signupValidation: require("../../middleware/signupValidation"),
  signinValidation: require("../../middleware/signinValidation"),
};

//Importing Auth Methods
const authGet = require("./methods/get"),
  authPost = require("./methods/post");

//Auth Methods
authGet(router);
authPost(router, middlewares);

module.exports = router;
