//Import Packages

//Import Utils
const error = require("../utils/error"),
  getUpdatedBodyAndExcludeFiles = require("../utils/getUpdatedBodyAndExcludeFiles"),
  getUpdatedBodyAndImages = require("../utils/getUpdatedBodyAndImages"),
  deletePlaceholderFromBody = require("../utils/deletePlaceholderFromBody"),
  getFileNamesFromBody = require("../utils/getFileNamesFromBody");

//Import Models
const User = require("../models/user"),
  Question = require("../models/question");
//   Answer = require("../models/answer");

//Queues
const imageDeleteQueue = require("../queues/imageDelete");

module.exports = {
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

      const excludeImages = [];

      bodyImages.forEach((image) => {
        if (updatedBodyImages.indexOf(image) === -1) {
          excludeImages.push(image);
        }
      });

      imageDeleteQueue.add({
        filenames: excludeImages,
      });

      answer.body = updatedBody;

      answer.markModified("body");

      const saveAnswer = await answer.save();
      if (!saveAnswer) {
        throw error("Answer not saved", 500);
      }

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

      imageDeleteQueue.add({
        filenames: excludedFilenames,
      });

      answer.body = updatedBody;

      answer.markModified("body");

      const saveAnswer = await answer.save();
      if (!saveAnswer) {
        throw error("Answer not saved");
      }

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

  deleteAnswer: async (req, res, next) => {
    try {
      const user = req.profile;
      const question = req.question;
      const answer = req.answer;
      const body = answer.body;

      const { answerId } = req.params;

      const excludeImages = getFileNamesFromBody(body).filter(
        (name) => name !== ""
      );

      imageDeleteQueue.add({
        filenames: excludeImages,
      });

      const deleteAnswer = await answer.remove();
      if (!deleteAnswer) {
        throw error("Answer Not Deleted");
      }

      user.answers.pull(answerId);
      user.markModified("answers");
      const saveUser = await user.save();
      if (!saveUser) {
        throw error("User Not Saved");
      }

      question.answers.pull(answerId);
      question.markModified("answers");
      const saveQuestion = await question.save();
      if (!saveQuestion) {
        throw error("Question not Saved");
      }

      res.json({
        message: "Answer Deleted Successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
};
