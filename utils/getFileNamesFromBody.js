const getFileNamesFromBody = (body) => {
  return body.map((item) => {
    const { insert } = item;

    if (insert) {
      const { image } = insert;

      if (image) {
        const filePath = image.split("/");
        return filePath[filePath.length - 1];
      }
    }
    return "";
  });
};
module.exports = getFileNamesFromBody;
