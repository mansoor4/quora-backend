//Import Models
const User = require("../database/models/user");

//Import Utils
const error = require("../utils/error");

const removeQuestionAndAnswerFromBookmarkProcess = async ({ data }) => {
  try {
    const { nonSanitizedBookmarks, sanitizedBookmarks, userId } = data;
    let update = nonSanitizedBookmarks.length !== sanitizedBookmarks.length;
    let message = `There is nothing to update in  user ${userId} bookmarks`;

    if (!update) {
      for (let i = 0; i < nonSanitizedBookmarks.length; i++) {
        if (
          nonSanitizedBookmarks[i].answers !== sanitizedBookmarks[i].answers
        ) {
          update = true;
          break;
        }
      }
    }

    if (update) {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        throw error("User not found");
      }

      let { bookmarks } = user;

      bookmarks = sanitizedBookmarks;

      user.markModified("bookmarks");
      const saveUser = await user.save();
      if (!saveUser) {
        throw error(
          `Bookmarks of user ${userId} not updated, Some error occurred`
        );
      }

      message = `Bookmarks of user ${userId} updated`;
    }

    return message;
  } catch (err) {
    throw err;
  }
};

module.exports = removeQuestionAndAnswerFromBookmarkProcess;
