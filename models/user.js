const mongoose = require("mongoose"),
  fs = require("fs"),
  path = require("path"),
  error = require("../utils/error"),
  environmentVariables = require("../config/environmentVariables"),
  writeTagFile = require("../utils/writeTagFile");

//Configure Environment variables
environmentVariables();

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      enum: [
        "None",
        "Computer Science & Engineering",
        "Information Technology",
        "Electronics & Telecommunication",
        "Electrical",
        "Mechanical",
        "Civil",
        "Instrumentation",
      ],
      default: "None",
    },
    year: {
      type: String,
      enum: ["1st", "2nd", "3rd", "4th", "None"],
      default: "None",
    },
    college: {
      type: String,
      default: null,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      default: null,
    },
    salt: {
      type: String,
      default: null,
    },
    profileImage: {
      type: {
        path: {
          type: String,
          default: null,
        },
        originalName: {
          type: String,
          default: null,
        },
        fileName: {
          type: String,
          default: null,
        },
        size: {
          type: String,
          default: null,
        },
      },
      default: null,
    },
    contact: {
      type: String,
      default: null,
    },
    emailVerify: {
      type: Boolean,
      default: false,
    },
    contactVerify: {
      type: Boolean,
      default: false,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

userSchema.statics.getTags = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, "..", process.env.TAG_FILE_NAME),
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

userSchema.statics.addTag = (tagName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { getTags } = userSchema.statics;
      const tags = await getTags();
      const findTag = tags.indexOf(tagName);
      if (findTag != -1) {
        throw error("Tag is already present", 422);
      }
      tags.push(tagName);
      const tagJson = JSON.stringify({ tags: tags });

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
      const { getTags } = userSchema.statics;
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
