const User = require("../models/user"),
  { randomBytes, pbkdf2Sync } = require("crypto"),
  error = require("../utils/error"),
  jwt = require("jsonwebtoken"),
  environmentVariables = require("../config/environmentVariables"),
  axios = require("axios");

//Configure Environment variables
environmentVariables();

//Controllers
module.exports = {
  signup: async (req, res, next) => {
    try {
      let { username, email, password } = req.body;

      const salt = randomBytes(16).toString("hex");

      const hashPassword = pbkdf2Sync(
        password,
        salt,
        1000,
        64,
        "sha512"
      ).toString("hex");

      password = hashPassword;

      const user = await User.create({
        username: username,
        email: email,
        password: password,
        salt: salt,
        profileImage: {
          path: null,
          originalName: null,
          size: null,
        },
      });

      if (!user) {
        throw error("User not created", 500);
      }

      const token = jwt.sign(
        { id: user._id, email: email },
        process.env.SECRET
      );

      return res.json({
        token: token,
        userId: user._id,
        profilePath: null,
        message: "Signup Successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  signin: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        throw error();
      }

      const token = jwt.sign(
        { id: user._id, email: email },
        process.env.SECRET
      );

      return res.json({
        token: token,
        userId: user._id,
        profilePath: null,
        profileCompleted: user.profileCompleted,
        message: "Signin Sucessfully",
      });
    } catch (err) {
      return next(err);
    }
  },

  googleLogin: async (req, res, next) => {
    try {
      const { id_token, access_token } = req.body;

      const userData = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      );

      const { email, verified_email, name, picture } = userData.data;
      let user = await User.findOne({ email: email });
      if (!user) {
        user = await User.create({
          email: email,
          username: name,
          emailVerify: verified_email,
          profileImage: {
            path: picture,
            originalName: null,
            size: null,
          },
        });
        if (!user) {
          throw error("User not created", 500);
        }
      }
      const token = jwt.sign(
        { id: user._id, email: email },
        process.env.SECRET
      );

      return res.json({
        token: token,
        userId: user._id,
        profilePath: picture,
        profileCompleted: user.profileCompleted,
        message: "Signin Sucessfully",
      });
    } catch (err) {
      return next(err);
    }
  },
};
