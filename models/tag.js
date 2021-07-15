const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    tags: {
      type: Array,
      default: [],
    },

    user: {
      profileImage: {
        type: String,
        default: null,
      },

      name: {
        type: String,
        required: true,
      },

      username: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tag", tagSchema);
