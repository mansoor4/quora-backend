const express = require("express"),
  router = express.Router();

//Importing Controllers
const { getImage } = require("../controllers/global");

//Routers

//GET
router.get("/getImage/:imageName", getImage);

module.exports = router;
