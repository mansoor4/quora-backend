const error = require("../utils/error");

const removeQuestionAndAnswerFromBookmarkProcess = async ({ data }) => {
  try {
    const { nonSanitizeBookmark, sanitizeBookmarks, user } = data;
    let update = nonSanitizeBookmark.length !== sanitizeBookmarks.length;
    let message = `There is nothing to update in  user ${user._id} bookmarks`;

    if (!update) {
      for (let i = 0; i < nonSanitizeBookmark.length; i++) {
        if (nonSanitizeBookmark[i].answers !== sanitizeBookmarks[i].answers) {
          update = true;
          break;
        }
      }
    }

    if (update) {
      user.bookmarks = sanitizeBookmarks;
      user.markModified("bookmarks");
      const saveUser = await user.save();
      if (!saveUser) {
        throw error(
          `Bookmarks of user ${user._id} not updated, Some error occurred`
        );
      }
      message = `Bookmarks of user ${user._id} updated`;
    }

    return message;
  } catch (err) {
    throw err;
  }
};

module.exports = removeQuestionAndAnswerFromBookmarkProcess;
