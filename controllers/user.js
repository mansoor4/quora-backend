//Import Packages
const _ = require("lodash"),
  fs = require("fs"),
  path = require("path");

//Import Utils
const error = require("../utils/error"),
  environmentVariables = require("../config/environmentVariables");
  
//Import Models
// const User = require("../models/user"),
const Question = require("../models/question"),
  Answer = require("../models/answer");

//Queues
const imageDeleteQueue = require("../queues/imageDelete"),
  answerDeleteFromUserQueue = require("../queues/answerDeleteFromUser");

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
        profileImage: req.files[0]
          ? {
              path:
                process.env.DOMAIN +
                "/api/user/getImage" +
                "/" +
                req.files[0].filename,
              originalName: req.files[0].originalname,
              fileName: req.files[0].filename,
              size: req.files[0].size,
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

      if (req.files[0]) {
        if (!(req.files[0].originalname === user.profileImage.originalName)) {
          profile = {
            ...profile,
            profileImage: {
              path:
                process.env.DOMAIN +
                "/api/user/getImage" +
                "/" +
                req.files[0].filename,
              originalName: req.files[0].originalname,
              fileName: req.files[0].filename,
              size: req.files[0].size,
            },
          };
        }
        if (user.profileImage.fileName) {
          imageDeleteQueue.add({
            filenames: new Array(user.profileImage.fileName),
          });
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
  getUser: async (req, res, next) => {
    try {
      const user = req.profile;
      const nonPopulatedAnswerOfUser = [...user.answers];

      const populatedUser = await user
        .populate({
          path: "questions",
          model: Question,
          select: "-body -user",
        })
        .populate({
          path: "answers",
          model: Answer,
          select: "question",
          populate: {
            path: "question",
            model: Question,
            select: "title user ",
            populate: {
              path: "user",
              model: User,
              select: "username profileImage.path",
            },
          },
        })
        .execPopulate();

      answerDeleteFromUserQueue.add({
        nonPopulatedAnswerOfUser,
        user,
      });

      return res.json({
        user: populatedUser,
      });
    } catch (err) {
      return next(err);
    }
  },
};
