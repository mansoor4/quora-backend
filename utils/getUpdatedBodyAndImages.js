const deletePlaceholderFromBody = require("./deletePlaceholderFromBody"),
  getFileNamesFromBody = require("./getFileNamesFromBody");

const getUpdatedBodyAndImages = (reqBody, oldBody) => {
  const updatedBody = deletePlaceholderFromBody(reqBody);

  const bodyImages = getFileNamesFromBody(oldBody);

  const updatedBodyImages = getFileNamesFromBody(updatedBody);

  return {
    updatedBody,
    updatedBodyImages,
    bodyImages,
  };
};

module.exports = getUpdatedBodyAndImages;
