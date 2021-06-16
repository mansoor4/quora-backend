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

//http://192.168.43.220:8000/api/user/getImage/9b536170-8e02-4393-9c85-aa502f3ffa99-image_picker5582662130484549866.jpg