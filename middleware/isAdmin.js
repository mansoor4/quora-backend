const error = require("../utils/error");

const isAdmin = (req, res, next) => {
  try {
    const user = req.profile;

    if (!user.admin) {
      throw error("You are not admin", 401);
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = isAdmin;
