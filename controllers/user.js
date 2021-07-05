//Import Packages
const _ = require("lodash"),
  {
    mongo: { ObjectId },
  } = require("mongoose");

//Import Utils
const environmentVariables = require("../config/environmentVariables");

//Import Models
const User = require("../models/user"),
  Question = require("../models/question"),
  Answer = require("../models/answer");

//Queues
const imageDeleteQueue = require("../queues/imageDelete"),
  answerDeleteFromUserQueue = require("../queues/answerDeleteFromUser");

//Configure Environment variables
environmentVariables();

//Controllers
module.exports = {
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
                "/api/getImage" +
                "/" +
                req.files[0].filename,
              originalName: req.files[0].originalname,
              fileName: req.files[0].filename,
              size: req.files[0].size,
            }
          : null,
      });

      await user.save();

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
                "/api/getImage" +
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
            filenames: [user.profileImage.fileName],
          });
        }
      }

      user = _.extend(user, profile);
      await user.save();

      return res.json({
        message: "Profile Updated Sucessfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  getUser: async (req, res, next) => {
    const user = req.profile;
    const nonPopulatedAnswerOfUser = [...user.answers];
    try {
      await user
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
        user,
      });
    } catch (err) {
      return next(err);
    }
  },
  addBookmark: async (req, res, next) => {
    const user = req.profile;
    const { questionId, answerId } = req.body;
    try {
      const bookmarkIndex = user.bookmark.findIndex((obj) =>
        obj.question.equals(questionId)
      );

      if (bookmarkIndex !== -1) {
        user.bookmark[bookmarkIndex].answers.push(answerId);
      } else {
        const newBookmark = { question: questionId, answers: [answerId] };
        user.bookmark.push(newBookmark);
      }

      await user.save();

      return res.json({
        message: "Answer bookmarked successfully ",
      });
    } catch (err) {
      return next(err);
    }
  },
  getBookmarks: async (req, res, next) => {
    const user = req.profile;
    try {
      await user
        .populate({
          path: "bookmark",
          select: "question answers",
          populate: {
            path: "question",
            model: Question,
            select: "title user",
            populate: {
              path: "user",
              model: User,
              select: "username profileImage.path",
            },
          },
        })
        .execPopulate();

      return res.json({
        bookmarks: user.bookmark,
      });
    } catch (err) {
      return next(err);
    }
  },
  deleteBookmark: async (req, res, next) => {
    const user = req.profile;
    const { questionId, answerIds } = req.body;
    try {
      const bookmarkIndex = user.bookmark.findIndex((obj) =>
        obj.question.equals(questionId)
      );

      const selectedBookmark = user.bookmark[bookmarkIndex];
      const answersAfterRemove = selectedBookmark.answers.filter(
        (answer) => answerIds.indexOf(answer) !== -1
      );
      if (answersAfterRemove.length) {
        selectedBookmark.answers = answersAfterRemove;
        user.bookmark[bookmarkIndex] = selectedBookmark;
      } else {
        user.bookmark.pull(selectedBookmark);
      }

      await user.save();
      return res.json({
        message: "Bookmark deleted successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  getSpecificQuestionBookmark: async (req, res, next) => {
    const user = req.profile;
    const { questionId } = req.query;
    try {
      const bookmarkIndex = user.bookmark.findIndex((obj) =>
        obj.question.equals(ObjectId(questionId))
      );

      await user
        .populate({
          path: "bookmark",
          populate: {
            path: "question",
            model: Question,
            select: "-answers",
            populate: {
              path: "user",
              model: User,
              select: "username profileImage.path",
            },
          },
          populate: {
            path: "answers",
            model: Answer,
            select: "-question",
            populate: {
              path: "user",
              model: User,
              select: "username profileImage.path",
            },
          },
        })
        .execPopulate();

      return res.json({
        selectedBookmark: user.bookmark[bookmarkIndex],
      });
    } catch (err) {
      return next(err);
    }
  },
};
