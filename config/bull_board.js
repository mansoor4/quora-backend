const { createBullBoard } = require("bull-board");
const { BullAdapter } = require("bull-board/bullAdapter");

//Importing Queues
const imageDelete = require("../queues/imageDelete");

//Configuring Bull Borad
const bullBoard = createBullBoard([new BullAdapter(imageDelete)]);

module.exports = bullBoard;
