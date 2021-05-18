const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      enum: [
        "C.S.E",
        "I.T",
        "Electrical",
        "Mechanical",
        "Civil",
        "Electronics",
        "NONE",
      ],
      default: null,
    },
    year: {
      type: String,
      enum: ["1st", "2nd", "3rd", "4th", "NONE"],
      default: null,
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
    numberVerify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
