const sanitizeBookmarks = (bookmarks) => {
  return bookmarks.filter((bookmark) => {
    const { question, answers } = bookmark;

    if (question !== null) {
      if (answers.length) {
        return true;
      }
    }
    return false;
  });
};

module.exports = sanitizeBookmarks;
