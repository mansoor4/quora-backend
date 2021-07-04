//Import Packages

//Import Utils
const getUpdatedBodyAndExcludeFiles = require("../utils/getUpdatedBodyAndExcludeFiles"),
  getUpdatedBodyAndImages = require("../utils/getUpdatedBodyAndImages"),
  deletePlaceholderFromBody = require("../utils/deletePlaceholderFromBody"),
  getFileNamesFromBody = require("../utils/getFileNamesFromBody");

//Import Models
const User = require("../models/user"),
  Question = require("../models/question"),
  Answer = require("../models/answer");

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

      user.answers.push(answer);
      question.answers.push(answer);

      await user.save();

      await question.save();

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

      await answer.save();

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

      await answer.save();

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

      await answer.remove();

      user.answers.pull(answerId);
      user.markModified("answers");

      await user.save();

      question.answers.pull(answerId);
      question.markModified("answers");

      await question.save();

      res.json({
        message: "Answer Deleted Successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  updateAnswerVote: async (req, res, next) => {
    const { type } = req.query;
    const { userId, upVote, downVote } = req.body;
    const answer = req.answer;
    let upPush = true;
    let downPush = true;
    try {
      if (type === "up") {
        if (downVote) {
          //pull userid from downVote
          //push userId in upVote
          answer.downVote.pull(userId);
        } else {
          if (upVote) {
            //pull userid from upVote
            upPush = false;
          }
        }
        if (upPush) {
          answer.upVote.push(userId);
        } else {
          answer.upVote.pull(userId);
        }
      } else {
        if (upVote) {
          //pull userid from upVote
          //push userId in downVote
          answer.upVote.pull(userId);
        } else {
          if (downVote) {
            //pull userid from downVote
            downPush = false;
          }
        }
        if (downPush) {
          answer.downVote.push(userId);
        } else {
          answer.downVote.pull(userId);
        }
      }

      await answer.save();

      return res.json({
        message: "Vote updated successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
};
