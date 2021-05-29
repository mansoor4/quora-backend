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
router.use("/:apiName/:id", isAuthenticated);
//POST
router.post("/createProfile/:userId", multerUpload, createProfile);
router.post("/updateProfile/:userId", multerUpload, updateProfile);

router.post("/createQuestion/:userId", createQuestion);

router.post("/createAnswer/:userId/:questionId", createAnswer);

//GET
router.get("/getImage/:imageName", getImage);

router.get("/getUser/:userId", getUser);

router.get("/getQuestion/:questionId", getQuestion);

module.exports = router;
