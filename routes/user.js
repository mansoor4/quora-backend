const express = require("express"),
  router = express.Router();

//Importing Controllers
const { getImage } = require("../controllers/user");

//Importing Middlewares
const multerUpload = require("../middleware/multerUpload"),
  getUserById = require("../middleware/getUserById");

//Params Middlewares
router.param("userId", getUserById);
//Routers

//POST
router.post("/createProfile/:userId", multerUpload);

//GET
router.get("/getImage/:imageName", getImage);

module.exports = router;
