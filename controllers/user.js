const fs = require("fs"),
  path = require("path"),
  error = require("../utils/error"),
  _ = require("lodash"),
  environmentVariables = require("../config/environmentVariables"),
  Question = require("../models/question");

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
      let { branch, year, contact, college } = req.body;
      college = college.trim();
      contact = contact.trim();
      let user = req.profile;
      user = _.extend(user, {
        branch,
        year,
        college,
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
              fileName: req.file.filename,
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
  updateProfile: async (req, res, next) => {
    try {
      let user = req.profile;
      let { branch, year, username, college } = req.body;
      username = username.trim();
      college = college.trim();
      let profile = { branch, year, username, college };

      if (req.file) {
        if (!(req.file.originalname === user.profileImage.originalName)) {
          profile = {
            ...profile,
            profileImage: {
              path:
                process.env.DOMAIN +
                "/api/user/getImage" +
                "/" +
                req.file.filename,
              originalName: req.file.originalname,
              fileName: req.file.filename,
              size: req.file.size,
            },
          };
        }
        if (user.profileImage.fileName) {
          fs.unlinkSync(
            path.join(__dirname, "..", "uploads", user.profileImage.fileName)
          );
        }
      }

      user = _.extend(user, profile);
      const saveUser = await user.save();
      if (!saveUser) {
        throw error("User not saved", 500);
      }
      return res.json({
        message: "Profile Updated Sucessfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  getUser: (req, res, next) => {
    return res.json({
      user: req.profile,
    });
  },

  createQuestion: async (req, res, next) => {
    try {
      let { title, body } = req.body;
      const user = req.profile;
      title = title.trim();
      const question = await Question.create({ title, body, userId: user._id });
      if (!question) {
        throw error("Question not created", 500);
      }
      user.questions.push(question);
      const saveUser = await user.save();
      if (!saveUser) {
        throw error("User not saved", 500);
      }

      return res.json({
        message: "Question created successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
};
