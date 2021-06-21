const path = require("path"),
  fs = require("fs");

const imageDeleteProcess = async ({ data }) => {
  const { filenames } = data;
  filenames.forEach((filename) => {
    fs.unlinkSync(path.join(__dirname, "..", "uploads", filename));
  });

  return `Deleted Successfully`;
};

module.exports = imageDeleteProcess;
