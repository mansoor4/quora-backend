//Import Packages
const {
  Types: { ObjectId },
} = require("mongoose");
//Import Models

const User = require("../database/models/user");

//Import Utils
const error = require("../utils/error");

const getUserById = async (req, _, next, id) => {
  try {
    let isValid = false;
    if (ObjectId.isValid(id)) {
      isValid = new ObjectId(id) == id;
    }

    let options = { _id: id };
    if (!isValid) {
      options = { username: id };
    }
    const user = await User.findOne(options).select("-password -salt");
    if (!user) {
      throw error("User not found", 404);
    }
    req.profile = user;

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = getUserById;
