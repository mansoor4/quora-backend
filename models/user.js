const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    required: true,
  },
  year: {
    type: String,
    enum: ["1st", "2nd", "3rd", "4th", "NONE"],
    required: true,
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
      },
      originalName: {
        type: String,
      },
      size: {
        type: String,
      },
    },
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
