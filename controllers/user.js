//Import Packages
const _ = require("lodash");

//Import Utils
const error = require("../utils/error"),
  environmentVariables = require("../config/environmentVariables"),
  sanitizeBookmarks = require("../utils/sanitizeBookmarks");

//Import Models
const User = require("../models/user"),
  Question = require("../models/question"),
  Answer = require("../models/answer");

//Queues
const imageDeleteQueue = require("../queues/imageDelete"),
  answerDeleteFromUserQueue = require("../queues/answerDeleteFromUser"),
  removeQuestionAndAnswerFromBookmarkQueue = require("../queues/removeQuestionAndAnswerFromBookmark");

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
    const { userId } = req.params;
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

      const populatedAnswerOfUser = [...user.answers];
      answerDeleteFromUserQueue.add({
        nonPopulatedAnswerOfUser,
        populatedAnswerOfUser,
        userId,
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
      const bookmarkIndex = user.bookmarks.findIndex((obj) =>
        obj.question.equals(questionId)
      );

      if (bookmarkIndex !== -1) {
        user.bookmarks[bookmarkIndex].answers.push(answerId);
      } else {
        const newBookmark = { question: questionId, answers: [answerId] };
        user.bookmarks.push(newBookmark);
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
    const { userId } = req.params;
    const nonSanitizedBookmarks = _.cloneDeep(user.bookmarks);
    try {
      await user
        .populate({
          path: "bookmarks",
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

      await user
        .populate({
          path: "bookmarks",
          populate: {
            path: "answers",
            model: Answer,
            select: "_id",
          },
        })
        .execPopulate();

      const sanitizedBookmarks = sanitizeBookmarks(user.bookmarks);

      removeQuestionAndAnswerFromBookmarkQueue.add({
        nonSanitizedBookmarks,
        sanitizedBookmarks,
        userId,
      });

      return res.json({
        bookmarks: sanitizedBookmarks,
      });
    } catch (err) {
      return next(err);
    }
  },
  deleteBookmark: async (req, res, next) => {
    const user = req.profile;
    const { questionId, answerIds } = req.body;
    try {
      const bookmarkIndex = user.bookmarks.findIndex((obj) =>
        obj.question.equals(questionId)
      );

      const selectedBookmark = user.bookmarks[bookmarkIndex];
      const answersAfterRemove = selectedBookmark.answers.filter(
        (answer) =>
          answerIds.findIndex((answerId) => answer.equals(answerId)) === -1
      );

      if (answersAfterRemove.length) {
        selectedBookmark.answers = answersAfterRemove;
        user.bookmarks[bookmarkIndex] = selectedBookmark;
      } else {
        user.bookmarks.pull(selectedBookmark);
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
      const bookmarkIndex = user.bookmarks.findIndex((obj) =>
        obj.question.equals(questionId)
      );

      await user
        .populate({
          path: "bookmarks",
          select: "question answers",
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
        })
        .execPopulate();

      await user
        .populate({
          path: "bookmarks",
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

      const selectedBookmark = user.bookmarks[bookmarkIndex];
      const question = selectedBookmark.question;
      const answers = selectedBookmark.answers;

      if (!question) {
        throw error("Question not found", 404);
      }

      if (!answers.length) {
        throw error("No Bookmarks are present", 404);
      }

      return res.json({
        selectedBookmark,
      });
    } catch (err) {
      return next(err);
    }
  },
  connectUser: async (req, res, next) => {
    const userToConnect = req.profile;
    const { Id } = req.body;
    const { userId } = req.params;
    try {
      const user = await User.findOne({ _id: Id }).select("-password -salt");
      if (!user) {
        throw error("User not found", 404);
      }

      const index = user.followings.findIndex((followingUser) =>
        followingUser.equals(userId)
      );

      if (index !== -1) {
        user.followings.pull(userId);
        userToConnect.followers.pull(Id);
      } else {
        user.followings.push(userId);
        userToConnect.followers.push(Id);
      }

      await user.save();

      await userToConnect.save();

      return res.json({
        message: "Done",
      });
    } catch (err) {
      return next(err);
    }
  },
};
