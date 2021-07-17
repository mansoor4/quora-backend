//Import Utils
const error = require("../utils/error");

const isAdmin = (req, _, next) => {
  try {
    const user = req.profile;
    const { admin } = user;

    if (!admin) {
      throw error("You are not admin", 401);
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = isAdmin;
