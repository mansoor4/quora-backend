const { createBullBoard } = require("bull-board");
const { BullAdapter } = require("bull-board/bullAdapter");

//Importing Queues
const imageDelete = require("../queues/imageDelete"),
  answerDeleteFromUser = require("../queues/answerDeleteFromUser"),
  removeQuestionAndAnswerFromBookmark = require("../queues/removeQuestionAndAnswerFromBookmark");

//Configuring Bull Borad
const bullBoard = createBullBoard([
  new BullAdapter(imageDelete),
  new BullAdapter(answerDeleteFromUser),
  new BullAdapter(removeQuestionAndAnswerFromBookmark),
]);

module.exports = bullBoard;
