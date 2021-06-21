const Queue = require("bull");

//Processes
const answerDeleteFromUserProcess = require("../processes/answerDeleteFromUserProcess");

const answerDeleteFromUser = new Queue("answerDeleteFromUser");

answerDeleteFromUser.process(answerDeleteFromUserProcess);

// imageDelete.on("completed", (job) => {
//   console.log(job);
// });

module.exports = answerDeleteFromUser;
