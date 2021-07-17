//Import Models
const User = require("../database/models/user"),
  Question = require("../database/models/question"),
  Answer = require("../database/models/answer");

//Import Utils
const getUpdatedBodyAndExcludeFiles = require("../utils/getUpdatedBodyAndExcludeFiles"),
  getUpdatedBodyAndImages = require("../utils/getUpdatedBodyAndImages"),
  deletePlaceholderFromBody = require("../utils/deletePlaceholderFromBody"),
  getFileNamesFromBody = require("../utils/getFileNamesFromBody"),
  error = require("../utils/error");

//Queues
const imageDeleteQueue = require("../queues/imageDelete");

module.exports = {
  createAnswer: async (req, res, next) => {
    const { body } = req.body;
    const { userId, questionId } = req.params;
    const user = req.profile;
    const question = req.question;
    const userAnswers = user.answers;
    const questionAnswers = question.answers;

    try {
      const updatedBody = deletePlaceholderFromBody(body);

      const answer = await Answer.create({
        body: updatedBody,
        user: userId,
        question: questionId,
      });

      userAnswers.push(answer);
      questionAnswers.push(answer);

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

      await answer
        .populate({
          path: "user",
          model: User,
          select: "name username profileImage.path",
        })
        .populate({
          path: "question",
          model: Question,
          select: "-answers",
          populate: {
            path: "user",
            model: User,
            select: "name username profileImage.path",
          },
        })
        .execPopulate();

      return res.json({
        answer,
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
          answer.downVote.pull(userId);
        } else {
          if (upVote) {
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
          answer.upVote.pull(userId);
        } else {
          if (downVote) {
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

  addComment: async (req, res, next) => {
    const answer = req.answer;
    const { text, user } = req.body;

    try {
      const newComment = {
        user,
        text,
      };
      answer.comments.push(newComment);

      await answer.save();

      return res.json({
        message: "Comment successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  addReply: async (req, res, next) => {
    const answer = req.answer;
    const { commentId } = req.params;
    const { text, user } = req.body;

    try {
      const newReply = { user, text };

      const commentIndex = answer.comments.findIndex((comment) =>
        comment._id.equals(commentId)
      );

      if (commentIndex === -1) {
        throw error("Comment not found", 404);
      }

      answer.comments[commentIndex].replies.push(newReply);

      await answer.save();

      return res.json({
        message: "Replied successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  updateComment: async (req, res, next) => {
    const answer = req.answer;
    const { commentId } = req.params;
    const { text } = req.body;

    try {
      const commentIndex = answer.comments.findIndex((comment) =>
        comment._id.equals(commentId)
      );

      answer.comments[commentIndex] = {
        ...answer.comments[commentIndex],
        text,
      };

      await answer.save();

      return res.json({
        message: "Comment update successfully",
      });
    } catch (err) {
      return next(err);
    }
  },

  updateReply: async (req, res, next) => {
    const answer = req.answer;
    const { commentId, replyId } = req.params;
    const { text } = req.body;

    try {
      const commentIndex = answer.comments.findIndex((comment) =>
        comment._id.equals(commentId)
      );

      if (commentIndex === -1) {
        throw error("Comment not found", 404);
      }

      const replyIndex = answer.comments[commentIndex].replies.findIndex(
        (reply) => reply._id.equals(replyId)
      );

      answer.comments[commentIndex].replies[replyIndex] = {
        ...answer.comments[commentIndex].replies[replyIndex],
        text,
      };

      await answer.save();

      return res.json({
        message: "Reply updated successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  deleteComment: async (req, res, next) => {
    const answer = req.answer;
    const { commentId } = req.params;

    try {
      answer.comments = answer.comments.filter(
        (comment) => !comment._id.equals(commentId)
      );

      await answer.save();

      return res.json({
        message: "Comment deleted successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  deleteReply: async (req, res, next) => {
    const answer = req.answer;
    const { commentId, replyId } = req.params;
    try {
      const commentIndex = answer.comments.findIndex((comment) =>
        comment._id.equals(commentId)
      );

      if (commentIndex === -1) {
        throw error("Comment not found", 404);
      }

      answer.comments[commentIndex].replies = answer.comments[
        commentIndex
      ].replies.filter((reply) => !reply._id.equals(replyId));

      await answer.save();

      return res.json({
        message: "Reply deleted successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
};
