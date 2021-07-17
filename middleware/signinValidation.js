//Import Packages
const { isEmpty, isEmail, normalizeEmail } = require("validator"),
  { pbkdf2Sync } = require("crypto");

//Import Models
const User = require("../database/models/user");

//Import Utils
const error = require("../utils/error");

const signinValidation = async (req, _, next) => {
  try {
    //Trim Whitespaces From Field
    req.body.email = req.body.email.trim();
    req.body.password = req.body.password.trim();

    let { email, password } = req.body;
    const { role } = req.query;

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

    if (user.password === null) {
      throw error(
        "You are signin with google login, reset password to sign in without google login",
        422
      );
    }

    const { salt } = user;

    const hashPassword = pbkdf2Sync(
      password,
      salt,
      1000,
      64,
      `sha512`
    ).toString(`hex`);

    if (hashPassword !== user.password) {
      throw error("Password is incorrect", 422);
    }

    if (role === "admin") {
      const { admin } = user;

      if (!admin) {
        throw error("You are not admin", 422);
      }
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = signinValidation;
