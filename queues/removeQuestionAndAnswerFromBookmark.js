const Queue = require("bull");

//Processes
const removeQuestionAndAnswerFromBookmarkProcess = require("../processes/removeQuestionAndAnswerFromBookmarkProcess");

const removeQuestionAndAnswerFromBookmark = new Queue(
  "removeQuestionAndAnswerFromBookmark"
);

removeQuestionAndAnswerFromBookmark.process(
  removeQuestionAndAnswerFromBookmarkProcess
);

// imageDelete.on("completed", (job) => {
//   console.log(job);
// });

module.exports = removeQuestionAndAnswerFromBookmark;
