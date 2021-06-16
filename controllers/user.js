const fs = require("fs"),
  path = require("path"),
  error = require("../utils/error"),
  _ = require("lodash"),
  environmentVariables = require("../config/environmentVariables"),
  Question = require("../models/question"),
  Answer = require("../models/answer"),
  User = require("../models/user"),
  deleteImages = require("../utils/deleteImages.js"),
  getUpdatedBodyAndExcludeFiles = require("../utils/getUpdatedBodyAndExcludeFiles"),
  getUpdatedBodyAndImages = require("../utils/getUpdatedBodyAndImages"),
  deletePlaceholderFromBody = require("../utils/deletePlaceholderFromBody"),
  imageDeleteQueue = require("../queues/imageDelete");

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
          deleteImages(new Array(user.profileImage.fileName));
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

      const updatedBody = deletePlaceholderFromBody(body);

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

  updateQuestion: async (req, res, next) => {
    try {
      let { body, tags } = req.body;
      let question = req.question;
      const questionBody = question.body;

      const { updatedBody, updatedBodyImages, bodyImages } =
        getUpdatedBodyAndImages(body, questionBody);

      question.body = updatedBody;
      question.tags = tags;

      question.markModified("body");
      question.markModified("tags");

      const saveQuestion = await question.save();
      if (!saveQuestion) {
        throw error("Question not saved", 500);
      }

      const exclusiveImages = [];
      bodyImages.forEach((image) => {
        if (updatedBodyImages.indexOf(image) === -1) {
          exclusiveImages.push(image);
        }
      });

      deleteImages(exclusiveImages);

      return res.json({
        message: "Question updated successfully",
      });
    } catch (err) {
      return next(err);
    }
  },

  questionImagesUpload: async (req, res, next) => {
    try {
      const { mode } = req.query;
      const question = req.question;
      const { body } = question;
      const multerFiles = req.files;

      const { updatedBody, excludedFilenames } = getUpdatedBodyAndExcludeFiles(
        multerFiles,
        body
      );

      question.body = updatedBody;

      question.markModified("body");

      const saveQuestion = await question.save();
      if (!saveQuestion) {
        throw error("Question not saved");
      }

      deleteImages(excludedFilenames);

      return res.json({
        message:
          mode === "create"
            ? "Question created successfully"
            : "Question updated successfully",
      });
    } catch (err) {
      return next(err);
    }
  },

  deleteQuestion: (req, res, next) => {
    try {
      res.json({
        message: "Done",
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

      const updatedBody = deletePlaceholderFromBody(body);

      const answer = await Answer.create({
        body: updatedBody,
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
        answerId: answer._id,
      });
    } catch (err) {
      return next(err);
    }
  },

  updateAnswer: async (req, res, next) => {
    try {
      let { body } = req.body;
      let answer = req.answer;
      const answerBody = answer.body;

      const { updatedBody, updatedBodyImages, bodyImages } =
        getUpdatedBodyAndImages(body, answerBody);

      answer.body = updatedBody;

      answer.markModified("body");

      const saveAnswer = await answer.save();
      if (!saveAnswer) {
        throw error("Answer not saved", 500);
      }

      const exclusiveImages = [];

      bodyImages.forEach((image) => {
        if (updatedBodyImages.indexOf(image) === -1) {
          exclusiveImages.push(image);
        }
      });

      deleteImages(exclusiveImages);

      return res.json({
        message: "Answer updated successfully",
      });
    } catch (err) {
      return next(err);
    }
  },

  answerImagesUpload: async (req, res, next) => {
    try {
      const { mode } = req.query;
      const answer = req.answer;
      const { body } = answer;
      const multerFiles = req.files;

      const { updatedBody, excludedFilenames } = getUpdatedBodyAndExcludeFiles(
        multerFiles,
        body
      );

      answer.body = updatedBody;

      answer.markModified("body");

      const saveAnswer = await answer.save();
      if (!saveAnswer) {
        throw error("Answer not saved");
      }

      deleteImages(excludedFilenames);

      return res.json({
        message:
          mode === "create"
            ? "Answer created successfully"
            : "Answer updated successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  getAnswer: async (req, res, next) => {
    try {
      const answer = req.answer;
      const populatedAnswer = await answer
        .populate({
          path: "user",
          model: User,
          select: "username profileImage.path",
        })
        .populate({
          path: "question",
          model: Question,
          select: "-answers",
          populate: {
            path: "user",
            model: User,
            select: "username profileImage.path",
          },
        })
        .execPopulate();

      if (!populatedAnswer) {
        throw error("Answer not saved", 500);
      }
      return res.json({
        answer: populatedAnswer,
      });
    } catch (err) {
      return next(err);
    }
  },

  deleteAnswer: (req, res, next) => {
    try {
    } catch (err) {
      return next(err);
    }
  },
};
