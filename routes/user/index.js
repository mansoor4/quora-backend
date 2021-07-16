const express = require("express"),
  router = express.Router();

//Importing Middlewares
const middlewares = {
  multerUpload: require("../../middleware/multerUpload"),
  isAuthenticated: require("../../middleware/isAuthenticated"),
};

//Importing Params Middlewares
const getUserById = require("../../middleware/getUserById");

//Importing User Methods
const userGet = require("./methods/get"),
  userPost = require("./methods/post"),
  userPut = require("./methods/put"),
  user_delete = require("./methods/_delete");

//Importing Bookmark Methods
const bookmarkGet = require("./bookmark/methods/get"),
  bookmarkPost = require("./bookmark/methods/post"),
  bookmark_delete = require("./bookmark/methods/_delete");

//Importing Connect Methods
const connectPut = require("./connect/methods/put");

//Params Middlewares
router.param("userId", getUserById);

//User Methods
userGet(router, middlewares);
userPost(router, middlewares);
userPut(router, middlewares);
user_delete(router, middlewares);

//Bookmark Methods
bookmarkGet(router, middlewares);
bookmarkPost(router, middlewares);
bookmark_delete(router, middlewares);

//Conenct Methods
connectPut(router, middlewares);

module.exports = router;
