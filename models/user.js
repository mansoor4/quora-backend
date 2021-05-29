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

module.exports = mongoose.model("User", userSchema);
