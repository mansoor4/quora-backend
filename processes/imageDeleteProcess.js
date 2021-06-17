const path = require("path"),
  fs = require("fs");

const imageDeleteProcess = async (job) => {
  const { filenames } = job.data;
  filenames.forEach((filename) => {
    fs.unlinkSync(path.join(__dirname, "..", "uploads", filename));
  });

  return `Deleted Successfully`;
};

module.exports = imageDeleteProcess;
