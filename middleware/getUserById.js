const User = require("../database/models/user"),
  error = require("../utils/error"),
  {
    Types: { ObjectId },
  } = require("mongoose");

const getUserById = async (req, res, next, id) => {
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
