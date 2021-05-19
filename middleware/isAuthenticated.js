const error = require("../utils/error"),
  jwt = require("jsonwebtoken"),
  environmentVariables = require("../config/environmentVariables");

//Configure Environment variables
environmentVariables();

const isAuthenticated = (req, res, next) => {
  try {
    const authorization = req.get("Authorization");
    if (!authorization) {
      throw error("You are not Authorized", 400);
    }
    console.log(authorization);
    const token = authorization.split(" ")[1];
    if (!token) {
      throw error("You are not Authorized", 400);
    }
    const decode = jwt.verify(token, process.env.SECRET);
    if (!decode) {
      throw error("You are not Authorized", 400);
    }
    console.log(decode);
    req.userId = decode.id;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = isAuthenticated;
