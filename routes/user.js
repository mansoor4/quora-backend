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
  isAuthenticated = require("../middleware/isAuthenticated"),
  getUserById = require("../middleware/getUserById");

//Params Middlewares
router.param("userId", getUserById);

//Routers

//GET
router.get("/getUser/:userId", isAuthenticated, getUser);


//POST
router.post(
  "/createProfile/:userId",
  isAuthenticated,
  multerUpload,
  createProfile
);

//PUT
router.put(
  "/updateProfile/:userId",
  isAuthenticated,
  multerUpload,
  updateProfile
);

//DELETE

module.exports = router;
