const Queue = require("bull");

//Processes
const removeQuestionAndAnswerFromBookmarkProcess = require("../processes/removeQuestionAndAnswerFromBookmarkProcess");

const removeQuestionAndAnswerFromBookmark = new Queue(
  "removeQuestionAndAnswerFromBookmark"
);

removeQuestionAndAnswerFromBookmark.process(
  removeQuestionAndAnswerFromBookmarkProcess
);

module.exports = removeQuestionAndAnswerFromBookmark;
