const getFileNamesFromBody = (body) => {
  return body.map((item) => {
    if (item.insert) {
      if (item.insert.image) {
        const filePath = item.insert.image.split("/");
        return filePath[filePath.length - 1];
      }
    }
    return "";
  });
};
module.exports = getFileNamesFromBody;
