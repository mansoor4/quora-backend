const express = require("express"),
  router = express.Router();

//Importing Controllers
const {
  createProfile,
  updateProfile,
  getUser,
  addBookmark,
  getBookmarks,
  deleteBookmark,
  getSpecificQuestionBookmark,
} = require("../controllers/user");

//Importing Middlewares
const multerUpload = require("../middleware/multerUpload"),
  isAuthenticated = require("../middleware/isAuthenticated"),
  getUserById = require("../middleware/getUserById");

//Params Middlewares
router.param("userId", getUserById);

//Routers

//GET
router.get("/getUser/:userId", isAuthenticated, getUser);
router.get("/getBookmarks/:userId", isAuthenticated, getBookmarks);
router.get(
  "/getSpecificQuestionBookmark/:userId",
  isAuthenticated,
  getSpecificQuestionBookmark
);

//POST
router.post(
  "/createProfile/:userId",
  isAuthenticated,
  multerUpload,
  createProfile
);
router.post("/addBookmark/:userId", isAuthenticated, addBookmark);

//PUT
router.put(
  "/updateProfile/:userId",
  isAuthenticated,
  multerUpload,
  updateProfile
);

//DELETE
router.delete("/deleteBookmark/:userId", isAuthenticated, deleteBookmark);
module.exports = router;
