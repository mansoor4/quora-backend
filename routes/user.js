const express = require("express"),
  router = express.Router();

//Importing Controllers
const {
  getImage,
  createProfile,
  updateProfile,
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
//GET
router.get("/getImage/:imageName", getImage);

module.exports = router;
