const express = require("express"),
  router = express.Router();

//Importing Controllers
const {
  getAllTags,
  addTagByName,
  deleteTagByName,
} = require("../controllers/tag");

//Importing Middlewares
const isAuthenticated = require("../middleware/isAuthenticated");

//Routers

//GET
router.get("/getAlltags", isAuthenticated, getAllTags);

//POST
router.post("/addTagByName", isAuthenticated, addTagByName);

//DELETE

router.delete("/deleteTagByName", isAuthenticated, deleteTagByName);

module.exports = router;
