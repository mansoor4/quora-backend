//Importing Controllers
const { signup, signin } = require("../../../controllers/auth");

const post = (router, { signupValidation, signinValidation }) => {
  router.post("/signup", signupValidation, signup);

  router.post("/signin", signinValidation, signin);
};

module.exports = post;
