const path = require("path"),
  fs = require("fs");

const deleteImages = (filenames) => {
  filenames.forEach((filename) => {
    fs.unlinkSync(path.join(__dirname, "..", "uploads", filename));
  });
};

module.exports = deleteImages;
