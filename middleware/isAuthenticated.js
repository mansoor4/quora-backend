//Import Packages
const jwt = require("jsonwebtoken");

//Import Utils
const error = require("../utils/error");

//Import Configs
environmentVariables = require("../config/environmentVariables");

//Configure Environment variables
environmentVariables();

const isAuthenticated = (req, _, next) => {
  try {
    const authorization = req.get("Authorization");
    if (!authorization) {
      throw error("You are not Authorized", 400);
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      throw error("You are not Authorized", 400);
    }
    const decode = jwt.verify(token, process.env.SECRET);
    if (!decode) {
      throw error("You are not Authorized", 400);
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = isAuthenticated;
