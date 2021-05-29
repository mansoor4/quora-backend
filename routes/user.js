const express = require("express"),
  router = express.Router();

//Importing Controllers
const {
  getImage,
  createProfile,
  updateProfile,
  getUser,
} = require("../controllers/user");

//Importing Middlewares
const multerUpload = require("../middleware/multerUpload"),
  getUserById = require("../middleware/getUserById"),
  isAuthenticated = require("../middleware/isAuthenticated");

//Params Middlewares
router.param("userId", getUserById);
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

router.post("/createQuestion/:userId",isAuthenticated)
//GET
router.get("/getImage/:imageName", getImage);
router.get("/getUser/:userId", isAuthenticated, getUser);

module.exports = router;
