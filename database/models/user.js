//Import Packages
const mongoose = require("mongoose"),
  fs = require("fs"),
  path = require("path");

//Import Utils
const error = require("../../utils/error"),
  writeTagFile = require("../../utils/writeTagFile");

//Configure Environment variables
const environmentVariables = require("../../config/environmentVariables");

//Import Schema
const userSchema = require("../schemas/user");

//Configure Environment variables
environmentVariables();

userSchema.statics.getTags = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, "..", "..", process.env.TAG_FILE_NAME),
      (err, data) => {
        if (err) {
          return reject(error("Tags file not found", 500));
        }
        const tagJson = JSON.parse(data);
        return resolve(tagJson.tags);
      }
    );
  });
};

userSchema.statics.addTags = (newTags) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { statics } = userSchema;
      const { getTags } = statics;

      const tags = await getTags();

      const sanitizeTags = newTags.map((tag) =>
        tag
          .split(" ")
          .map(
            (splitTag) =>
              splitTag.charAt(0).toUpperCase() + splitTag.slice(1).toLowerCase()
          )
          .join(" ")
      );

      const newUpdatedTags = sanitizeTags.filter((tag) => {
        if (tags.indexOf(tag) == -1) {
          return true;
        }
        return false;
      });

      const concatedTags = tags.concat(newUpdatedTags);

      const tagJson = JSON.stringify({ tags: concatedTags });

      const result = await writeTagFile(tagJson);

      if (result) {
        return resolve(true);
      }
    } catch (err) {
      return reject(err);
    }
  });
};

userSchema.statics.deleteTag = (tagName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { statics } = userSchema;
      const { getTags } = statics;

      const tags = await getTags();

      const filterTags = tags.filter((tag) => tag !== tagName);
      if (filterTags.length === tags.length) {
        throw error("Tag is not present", 422);
      }

      const tagJson = JSON.stringify({ tags: filterTags });

      const result = await writeTagFile(tagJson);

      if (result) {
        return resolve(true);
      }
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports = mongoose.model("User", userSchema);
