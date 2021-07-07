const sanitizeBookmarks = (bookmarks) => {
  return bookmarks.filter((bookmark) => {
    if (bookmark.question !== null) {
      if (bookmark.answers.length) {
        return true;
      }
    }
    return false;
  });
};

module.exports = sanitizeBookmarks;
