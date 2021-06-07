const path = require("path"),
  fs = require("fs");

const deleteImages = (filenames) => {
  if (Array.isArray(filenames)) {
    filenames.forEach((filename) => {
      fs.unlinkSync(path.join(__dirname, "..", "uploads", filename));
    });
  } else {
    fs.unlinkSync(path.join(__dirname, "..", "uploads", filename));
  }
};

module.exports = deleteImages;
