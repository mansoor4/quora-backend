const deletePlaceholderFromBody = (body) => {
  const updatedBody = body.filter((item) => {
    const { insert } = item;

    if (insert) {
      const { image } = insert;
      
      return image != process.env.IMAGE_PLACEHOLDER;
    }
    return false;
  });
  return updatedBody;
};

module.exports = deletePlaceholderFromBody;
