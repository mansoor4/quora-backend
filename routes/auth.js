const express = require("express"),
  router = express.Router();

//Importing Controllers
const { signup, signin, googleLogin } = require("../controllers/auth");

//Importing Middlewares
const signupValidation = require("../middleware/signupValidation"),
  signinValidation = require("../middleware/signinValidation");

//Routers

//GET
router.post("/googleLogin", googleLogin);

//POST
router.post("/signup", signupValidation, signup);
router.post("/signin", signinValidation, signin);

module.exports = router;
