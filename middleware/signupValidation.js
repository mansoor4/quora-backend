const { isEmpty, isEmail, normalizeEmail, isLength } = require("validator"),
  error = require("../utils/error"),
  User = require("../models/user");

const signupValidation = async (req, res, next) => {
  try {
    //Trim Whitespaces From Field
    req.body.username = req.body.username.trim();
    req.body.email = req.body.email.trim();
    req.body.password = req.body.password.trim();

    let { email, username, password } = req.body;

    //Check Empty Fields
    if (isEmpty(username) || isEmpty(email)) {
      throw error("Fill all the input fields", 422);
    }

    //Email Validation
    normalizeEmail(email);
    if (!isEmail(email)) {
      throw error("Enter a valid email", 422);
    }

    const user = await User.findOne({ email: email });
    if (user) {
      throw error("You are already register,You can login", 422);
    }

    //Password Validation
    if (!isLength(password, { min: 6 })) {
      throw error("Password should have more than 6 character", 422);
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = signupValidation;
