const deletePlaceholderFromBody = (body) => {
  const updatedBody = body.filter((item) => {
    if (item.insert) {
      return item.insert.image != process.env.IMAGE_PLACEHOLDER;
    }
    return false;
  });
  return updatedBody;
};

module.exports = deletePlaceholderFromBody;
