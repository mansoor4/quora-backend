const express = require("express"),
  router = express.Router();

//Importing Middlewares
const middlewares = {
  isAuthenticated: require("../../middleware/isAuthenticated"),
  isAdmin: require("../../middleware/isAdmin"),
};

//Importing Params Middlewares
const getUserById = require("../../middleware/getUserById");

//Importing Tag Methods
const tagGet = require("./methods/get"),
  tagPost = require("./methods/post"),
  tag_delete = require("./methods/_delete");

//Params Middlewares
router.param("userId", getUserById);

//Auth Methods
tagGet(router, middlewares);
tagPost(router, middlewares);
tag_delete(router, middlewares);

module.exports = router;
