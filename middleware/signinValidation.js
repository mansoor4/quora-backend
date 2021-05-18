const { trim, isEmpty, isEmail, normalizeEmail } = require("validator"),
  error = require("../utils/error"),
  User = require("../models/user"),
  { pbkdf2Sync } = require("crypto");

const signinValidation = async (req, res, next) => {
  try {
    //Trim Whitespaces From Field
    req.body.email = req.body.email.trim();
    req.body.password = req.body.password.trim();

    let { email, password } = req.body;

    //Email Validation
    if (isEmpty(email)) {
      throw error("Fill all the input fields", 422);
    }

    normalizeEmail(email);

    if (!isEmail(email)) {
      throw error("Enter a valid email", 422);
    }

    //Password Validation
    const user = await User.findOne({ email: email });
    if (!user) {
      throw error("You are not register, goto signup and register", 422);
    }
    const hashPassword = pbkdf2Sync(
      password,
      user.salt,
      1000,
      64,
      `sha512`
    ).toString(`hex`);

    if (hashPassword !== user.password) {
      throw error("Password is incorrect", 422);
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = signinValidation;
