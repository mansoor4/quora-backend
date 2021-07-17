//Importing Controllers
const { signup, signin, googleLogin } = require("../../../controllers/auth");

const post = (router, { signupValidation, signinValidation }) => {
  router.post("/googleLogin", googleLogin);

  router.post("/signup", signupValidation, signup);

  router.post("/signin", signinValidation, signin);
};

module.exports = post;
