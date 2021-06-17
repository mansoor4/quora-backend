const Queue = require("bull");

//Processes
const imageDeleteProcess = require("../processes/imageDeleteProcess");

const imageDelete = new Queue("imageDelete");

imageDelete.process(imageDeleteProcess);
// imageDelete.on("completed", (job) => {
//   console.log(job);
// });
module.exports = imageDelete;
