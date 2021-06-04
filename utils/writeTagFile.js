const fs = require("fs"),
  path = require("path"),
  environmentVariables = require("../config/environmentVariables");

//Configure Environment variables
environmentVariables();

const writeTagFile = (tagJson) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.join(__dirname, "..", process.env.TAG_FILE_NAME),
      tagJson,
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(true);
      }
    );
  });
};

module.exports = writeTagFile;
