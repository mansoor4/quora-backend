const fs = require("fs"),
  path = require("path"),
  error = require("../utils/error"),
  _ = require("lodash"),
  environmentVariables = require("../config/environmentVariables"),
  Question = require("../models/question"),
  Answer = require("../models/answer"),
  User = require("../models/user"),
  deleteImages = require("../utils/deleteImages.js");

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
  getUser: async (req, res, next) => {
    try {
      const user = req.profile;
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

      return res.json({
        user: populatedUser,
      });
    } catch (err) {
      return next(err);
    }
  },

  createQuestion: async (req, res, next) => {
    try {
      let { title, body, tags } = req.body;
      const { userId } = req.params;
      const user = req.profile;
      title = title.trim();

      const updatedBody = body.filter((item) => {
        if (item.insert) {
          return item.insert.image != process.env.IMAGE_PLACEHOLDER;
        }
        return false;
      });

      const question = await Question.create({
        title: title,
        body: updatedBody,
        user: userId,
        tags: tags,
      });
      if (!question) {
        throw error("Question not created", 500);
      }
      user.questions.push(question);
      const saveUser = await user.save();
      if (!saveUser) {
        throw error("User not saved", 500);
      }

      return res.json({
        questionId: question._id,
      });
    } catch (err) {
      return next(err);
    }
  },

  updateQuestion: (req, res, next) => {
    try {
      let { title, body, tags } = req.body;
      const question = req.question;
      title = title.trim();

      const updatedBody = body.filter((item) => {
        if (item.insert) {
          return item.insert.image != process.env.IMAGE_PLACEHOLDER;
        }
        return false;
      });
    } catch (err) {
      return next(err);
    }
  },

  questionImagesUpload: async (req, res, next) => {
    try {
      const question = req.question;
      const { body } = question;
      const multerFiles = req.files;

      const fileImages = multerFiles.map((file) => {
        return file.originalname;
      });

      const bodyImages = body.map((item) => {
        if (item.insert) {
          if (item.insert.image) {
            const filePath = item.insert.image.split("/");
            return filePath[filePath.length - 1];
          }
        }
        return "";
      });

      const includedImages = fileImages.filter((image) => {
        return bodyImages.indexOf(image) != -1;
      });

      const excludedImages = fileImages.filter((image) => {
        return bodyImages.indexOf(image) == -1;
      });

      const excludedFilenames = excludedImages.map((item) => {
        for (let i = 0; i < multerFiles.length; i++) {
          if (multerFiles[i].originalname === item) {
            return multerFiles[i].filename;
          }
        }
      });

      const includedFilenames = includedImages.map((item) => {
        for (let i = 0; i < multerFiles.length; i++) {
          if (multerFiles[i].originalname === item) {
            return multerFiles[i].filename;
          }
        }
      });

      let i = 0;
      const updatedBody = body.map((item) => {
        if (item.insert) {
          if (
            item.insert.image &&
            item.insert.image.split("/")[0] !== process.env.DOMAIN
          ) {
            item.insert.image =
              process.env.DOMAIN +
              "/api/user/getImage" +
              "/" +
              includedFilenames[i];
            i++;
          }
          return item;
        }
      });

      console.log(updatedBody);

      question.body = updatedBody;

      deleteImages(excludedFilenames);

      const saveQuestion = await question.save();
      if (!saveQuestion) {
        throw error("Question not saved");
      }

      return res.json({
        message: "Question created successfully",
      });
    } catch (err) {
      return next(err);
    }
  },

  getQuestion: async (req, res, next) => {
    try {
      const question = req.question;
      const populatedQuestion = await question
        .populate({
          path: "user",
          model: User,
          select: "username profileImage.path",
        })
        .populate({
          path: "answers",
          model: Answer,
          select: "-question",
          populate: {
            path: "user",
            model: User,
            select: "username profileImage.path",
          },
        })
        .execPopulate();

      if (!populatedQuestion) {
        throw error("Question not saved", 500);
      }
      return res.json({
        question: populatedQuestion,
      });
    } catch (err) {
      return next(err);
    }
  },
  createAnswer: async (req, res, next) => {
    try {
      const { body } = req.body;
      const { userId, questionId } = req.params;
      const user = req.profile;
      const question = req.question;
      const answer = await Answer.create({
        body,
        user: userId,
        question: questionId,
      });
      if (!answer) {
        throw error("Answer not crated", 500);
      }
      user.answers.push(answer);
      question.answers.push(answer);

      const saveUser = await user.save();
      if (!saveUser) {
        throw error("user not saved");
      }

      const saveQuestion = await question.save();
      if (!saveQuestion) {
        throw error("Question not saved");
      }

      return res.json({
        message: "Answer created successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
};
