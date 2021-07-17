const express = require("express"),
  router = express.Router();

//Importing Middlewares
const middlewares = {
  signupValidation: require("../../middleware/signupValidation"),
  signinValidation: require("../../middleware/signinValidation"),
};

//Importing Auth Methods
const authPost = require("./methods/post");

//Auth Methods
authPost(router, middlewares);

module.exports = router;
