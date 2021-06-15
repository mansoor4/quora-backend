const deletePlaceholderFromBody = require("./deletePlaceholderFromBody"),
  getFileNamesFromBody = require("./getFileNamesFromBody");

const getUpdatedBodyAndImages = (body, reqBody) => {
  const updatedBody = deletePlaceholderFromBody(reqBody);

  const bodyImages = getFileNamesFromBody(body);

  const updatedBodyImages = getFileNamesFromBody(updatedBody);

  return {
    updatedBody,
    updatedBodyImages,
    bodyImages,
  };
};

module.exports = getUpdatedBodyAndImages;
