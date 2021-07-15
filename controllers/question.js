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

      user.questions.push(question);
      await user.save();

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

      const excludeImages = [];
      bodyImages.forEach((image) => {
        if (updatedBodyImages.indexOf(image) === -1) {
          excludeImages.push(image);
        }
      });

      imageDeleteQueue.add({
        filenames: excludeImages,
      });

      question.body = updatedBody;
      question.tags = tags;

      question.markModified("body");
      question.markModified("tags");

      await question.save();

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

      imageDeleteQueue.add({
        filenames: excludedFilenames,
      });

      question.body = updatedBody;

      question.markModified("body");

      await question.save();

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

  deleteQuestion: async (req, res, next) => {
    try {
      const user = req.profile;
      const question = req.question;

      const { questionId } = req.params;

      const deleteAnswers = question.answers;

      let excludedImages = getFileNamesFromBody(question.body).filter(
        (name) => name !== ""
      );

      const answersOfQuestion = await Answer.find({
        _id: { $in: deleteAnswers },
      }).select("body");

      answersOfQuestion.forEach((answer) => {
        excludedImages = excludedImages.concat(
          getFileNamesFromBody(answer.body).filter((name) => name !== "")
        );
      });

      imageDeleteQueue.add({
        filenames: excludedImages,
      });

      await question.remove();

      user.questions.pull(questionId);
      await user.save();

      await Answer.deleteMany({
        _id: { $in: deleteAnswers },
      });

      res.json({
        message: "Question Deleted Successfully",
      });
    } catch (err) {
      return next(err);
    }
  },

  getQuestion: async (req, res, next) => {
    const question = req.question;
    const { userId } = req.params;

    try {
      const userIndex = question.views.findIndex((user) => user.equals(userId));

      if (userIndex === -1) {
        question.views.push(userId);
        await question.save();
      }

      await question
        .populate({
          path: "user",
          model: User,
          select: "name username profileImage.path",
        })
        .populate({
          path: "answers",
          model: Answer,
          select: "-question",
          populate: {
            path: "user",
            model: User,
            select: "name username profileImage.path",
          },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
            model: User,
            select: "name username profileImage.path",
          },
        })
        .execPopulate();

      await question
        .populate({
          path: "comments",
          populate: {
            path: "replies",
            populate: {
              path: "user",
              model: User,
              select: "name username profileImage.path",
            },
          },
        })
        .execPopulate();

      return res.json({
        question,
      });
    } catch (err) {
      return next(err);
    }
  },

  updateQuestionVote: async (req, res, next) => {
    const { type } = req.query;
    const { userId, upVote, downVote } = req.body;
    const question = req.question;
    let upPush = true;
    let downPush = true;
    try {
      if (type === "up") {
        if (downVote) {
          question.downVote.pull(userId);
        } else {
          if (upVote) {
            upPush = false;
          }
        }
        if (upPush) {
          question.upVote.push(userId);
        } else {
          question.upVote.pull(userId);
        }
      } else {
        if (upVote) {
          question.upVote.pull(userId);
        } else {
          if (downVote) {
            downPush = false;
          }
        }
        if (downPush) {
          question.downVote.push(userId);
        } else {
          question.downVote.pull(userId);
        }
      }

      await question.save();

      return res.json({
        message: "Vote updated successfully",
      });
    } catch (err) {
      return next(err);
    }
  },

  addComment: async (req, res, next) => {
    const question = req.question;
    const { text, user } = req.body;

    try {
      const newComment = {
        user,
        text,
      };
      question.comments.push(newComment);

      await question.save();

      return res.json({
        message: "Comment successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  addReply: async (req, res, next) => {
    const question = req.question;
    const { commentId } = req.params;
    const { text, user } = req.body;

    try {
      const newReply = { user, text };

      const commentIndex = question.comments.findIndex((comment) =>
        comment._id.equals(commentId)
      );

      if (commentIndex === -1) {
        throw error("Comment not found", 404);
      }

      question.comments[commentIndex].replies.push(newReply);

      await question.save();

      return res.json({
        message: "Replied successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  updateComment: async (req, res, next) => {
    const question = req.question;
    const { commentId } = req.params;
    const { text } = req.body;

    try {
      const commentIndex = question.comments.findIndex((comment) =>
        comment._id.equals(commentId)
      );

      question.comments[commentIndex] = {
        ...question.comments[commentIndex],
        text,
      };

      await question.save();

      return res.json({
        message: "Comment update successfully",
      });
    } catch (err) {
      return next(err);
    }
  },

  updateReply: async (req, res, next) => {
    const question = req.question;
    const { commentId, replyId } = req.params;
    const { text } = req.body;

    try {
      const commentIndex = question.comments.findIndex((comment) =>
        comment._id.equals(commentId)
      );

      if (commentIndex === -1) {
        throw error("Comment not found", 404);
      }

      const replyIndex = question.comments[commentIndex].replies.findIndex(
        (reply) => reply._id.equals(replyId)
      );

      question.comments[commentIndex].replies[replyIndex] = {
        ...question.comments[commentIndex].replies[replyIndex],
        text,
      };

      await question.save();

      return res.json({
        message: "Reply updated successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  deleteComment: async (req, res, next) => {
    const question = req.question;
    const { commentId } = req.params;

    try {
      question.comments = question.comments.filter(
        (comment) => !comment._id.equals(commentId)
      );

      await question.save();

      return res.json({
        message: "Comment deleted successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  deleteReply: async (req, res, next) => {
    const question = req.question;
    const { commentId, replyId } = req.params;
    try {
      const commentIndex = question.comments.findIndex((comment) =>
        comment._id.equals(commentId)
      );

      if (commentIndex === -1) {
        throw error("Comment not found", 404);
      }

      question.comments[commentIndex].replies = question.comments[
        commentIndex
      ].replies.filter((reply) => !reply._id.equals(replyId));

      await question.save();

      return res.json({
        message: "Reply deleted successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
};
