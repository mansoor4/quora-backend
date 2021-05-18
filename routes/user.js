const express = require("express"),
  router = express.Router();

//Importing Controllers
const { getImage } = require("../controllers/user");
//Importing Middlewares

//Routers

//POST
router.get("/getImage/:imageName", getImage);

module.exports = router;
