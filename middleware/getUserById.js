const User = require("../models/user"),
  error = require("../utils/error");

const getUserById = async (req, res, next, id) => {
  try {
    const user = await User.findOne({ _id: id }).select("-password -salt");
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
