const Queue = require("bull");

const imageDelete = new Queue("imageDelete");

module.exports=imageDelete
