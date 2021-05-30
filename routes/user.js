const express = require("express"),
  router = express.Router();

//Importing Controllers
const {
  getImage,
  createProfile,
  updateProfile,
  getUser,
  createQuestion,
  getQuestion,
  createAnswer,
} = require("../controllers/user");

//Importing Middlewares
const multerUpload = require("../middleware/multerUpload"),
  getUserById = require("../middleware/getUserById"),
  getQuestionById = require("../middleware/getQuestionById"),
  isAuthenticated = require("../middleware/isAuthenticated");

//Params Middlewares
router.param("userId", getUserById);
router.param("questionId", getQuestionById);
//Routers

//POST
router.post(
  "/createProfile/:userId",
  isAuthenticated,
  multerUpload,
  createProfile
);
router.post(
  "/updateProfile/:userId",
  isAuthenticated,
  multerUpload,
  updateProfile
);

router.post("/createQuestion/:userId", isAuthenticated, createQuestion);

router.post("/createAnswer/:userId/:questionId", isAuthenticated, createAnswer);

//GET
router.get("/getImage/:imageName", getImage);

router.get("/getUser/:userId", isAuthenticated, getUser);

router.get("/getQuestion/:questionId", isAuthenticated, getQuestion);

module.exports = router;
