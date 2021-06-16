const Queue = require("bull");

const imageDelete = new Queue("imageDelete");
// imageDelete.process()
module.exports=imageDelete
