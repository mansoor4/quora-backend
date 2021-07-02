//Import Packages

//Import Utils
const error = require("../utils/error"),
  getUpdatedBodyAndExcludeFiles = require("../utils/getUpdatedBodyAndExcludeFiles"),
  getUpdatedBodyAndImages = require("../utils/getUpdatedBodyAndImages"),
  deletePlaceholderFromBody = require("../utils/deletePlaceholderFromBody"),
  getFileNamesFromBody = require("../utils/getFileNamesFromBody");

//Import Models
const User = require("../models/user"),
  //   Question = require("../models/question"),
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

      const saveQuestion = await question.save();
      if (!saveQuestion) {
        throw error("Question not saved", 500);
      }

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

      const saveQuestion = await question.save();
      if (!saveQuestion) {
        throw error("Question not saved");
      }

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
      if (!answersOfQuestion.length) {
        throw error();
      }

      answersOfQuestion.forEach((answer) => {
        excludedImages = excludedImages.concat(
          getFileNamesFromBody(answer.body).filter((name) => name !== "")
        );
      });

      imageDeleteQueue.add({
        filenames: excludedImages,
      });

      const deleteQuestion = await question.remove();
      if (!deleteQuestion) {
        throw error("Answer Not Deleted");
      }

      user.questions.pull(questionId);
      const saveUser = await user.save();
      if (!saveUser) {
        throw error("User not saved");
      }

      const answerAfterDeletion = await Answer.deleteMany({
        _id: { $in: deleteAnswers },
      });

      if (!answerAfterDeletion.ok) {
        throw error();
      }

      res.json({
        message: "Question Deleted Successfully",
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

  updateQuestionVote: (req, res, next) => {
    const { type } = req.query;
    const { userId, upVote, downVote } = req.body;
    try {
        if(type==="up"){
          if(!upVote && !downVote){

          }
          else if(!upVote && downVote){
              
          }
        }
        else{

        }
    } catch (err) {
      return next(err);
    }
  },
};
