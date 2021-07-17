//Import Packages
const axios = require("axios"),
  { randomBytes, pbkdf2Sync } = require("crypto"),
  jwt = require("jsonwebtoken");

//Import Models
const User = require("../database/models/user");

//Import Configs
const environmentVariables = require("../config/environmentVariables");

//Configure Environment variables
environmentVariables();

//Controllers
module.exports = {
  signup: async (req, res, next) => {
    try {
      let { name, email, password, firebaseToken } = req.body;

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
        name: name,
        email: email,
        password: password,
        salt: salt,
        profileImage: {
          path: null,
          originalName: null,
          fileName: null,
          size: null,
        },
        tokens: [firebaseToken],
      });

      const { _id } = user;

      const jwtToken = jwt.sign({ email: email }, process.env.SECRET);

      return res.json({
        token: jwtToken,
        userId: _id,
        profilePath: null,
        message: "Signup Successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  signin: async (req, res, next) => {
    try {
      const { role } = req.query;
      const { email, firebaseToken } = req.body;
      const user = await User.findOne({ email: email });

      const { profileCompleted, _id } = user;

      if (firebaseToken) {
        const { tokens } = user;
        const tokenIndex = tokens.findIndex((token) => token === firebaseToken);
        if (tokenIndex === -1) {
          tokens.push(firebaseToken);

          await user.save();
        }
      }

      let payload = {};
      if (role !== "admin") {
        payload = { email: email };
      }

      const jwtToken = jwt.sign(payload, process.env.SECRET);

      let information = {};

      if (role !== "admin") {
        information = {
          profilePath: null,
          profileCompleted,
          message: "Signin Sucessfully",
        };
      }

      return res.json({
        token: jwtToken,
        userId: _id,
        ...information,
      });
    } catch (err) {
      return next(err);
    }
  },

  googleLogin: async (req, res, next) => {
    try {
      const { id_token, access_token, firebaseToken } = req.body;

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
          name: name,
          emailVerify: verified_email,
          profileImage: {
            path: picture,
            originalName: null,
            fileName: null,
            size: null,
          },
        });
      }

      const { profileCompleted, _id } = user;

      if (firebaseToken) {
        const { tokens } = user;
        const tokenIndex = tokens.findIndex((token) => token === firebaseToken);
        if (tokenIndex === -1) {
          tokens.push(firebaseToken);
          await user.save();
        }
      }

      const jwtToken = jwt.sign({ email: email }, process.env.SECRET);

      return res.json({
        token: jwtToken,
        userId: _id,
        profilePath: picture,
        profileCompleted,
        message: "Signin Sucessfully",
      });
    } catch (err) {
      return next(err);
    }
  },
};
