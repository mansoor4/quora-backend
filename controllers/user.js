const fs = require("fs"),
  path = require("path"),
  error = require("../utils/error"),
  _ = require("lodash"),
  environmentVariables = require("../config/environmentVariables");

//Configure Environment variables
environmentVariables();

//Controllers
module.exports = {
  getImage: (req, res, next) => {
    try {
      const { imageName } = req.params;
      fs.readFile(
        path.join(__dirname, "..", "uploads", imageName),
        (err, data) => {
          if (err) {
            return next(err);
          }
          return res.send(data);
        }
      );
    } catch (err) {
      return next(err);
    }
  },

  createProfile: async (req, res, next) => {
    try {
      const { branch, year, contact } = req.body;
      let user = req.profile;
      user = _.extend(user, {
        branch,
        year,
        contact,
        profileCompleted: true,
        profileImage: req.file
          ? {
              path:
                process.env.DOMAIN +
                "/api/user/getImage" +
                "/" +
                req.file.filename,
              originalName: req.file.originalname,
              size: req.file.size,
            }
          : null,
      });

      const saveUser = await user.save();
      if (!saveUser) {
        throw error("User not saved", 500);
      }
      return res.json({
        message: "Profile created successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  updateProfile: (req, res, next) => {
    const user = req.profile;
  },
};
