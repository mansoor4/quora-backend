const express = require("express"),
  router = express.Router();

//Importing Controllers
const {
  getAllTags,
  getAllAdminTags,
  addTags,
  deleteTagByName,
} = require("../controllers/tag");

//Importing Middlewares
const isAuthenticated = require("../middleware/isAuthenticated"),
  isAdmin = require("../middleware/isAdmin"),
  getUserById = require("../middleware/getUserById");

//Params Middlewares
router.param("userId", getUserById);

//Routers

//GET
router.get("/getAlltags", isAuthenticated, getAllTags);
router.get(
  "/getAllAdminTags/:userId",
  isAuthenticated,
  isAdmin,
  getAllAdminTags
);

//POST
router.post("/addTagByName/:userId", isAuthenticated, isAdmin, addTags);

//DELETE
router.delete(
  "/deleteTagByName/:userId",
  isAuthenticated,
  isAdmin,
  deleteTagByName
);

module.exports = router;
