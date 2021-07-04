const sanitizeTags = (tags) => {
  const trimTags = tags.map((tag) => {
    if (tag) {
      const removedWhiteSpaceTags = tag
        .split(" ")
        .filter((word) => word !== "")
        .join(" ");

      return removedWhiteSpaceTags;
    }
    return tag;
  });
  return trimTags.filter((tag) => {
    return tag && tag.trim() !== "";
  });
};

module.exports = sanitizeTags;
