//Import Utils
const getFileNamesFromBody = require("./getFileNamesFromBody");

const getUpdatedBodyAndExcludeFiles = (multerFiles, body) => {
  const fileImages = multerFiles.map((file) => {
    return file.originalname;
  });

  const bodyImages = getFileNamesFromBody(body);

  const includedImages = fileImages.filter((image) => {
    return bodyImages.indexOf(image) != -1;
  });

  const excludedImages = fileImages.filter((image) => {
    return bodyImages.indexOf(image) == -1;
  });

  const excludedFilenames = excludedImages.map((item) => {
    for (let i = 0; i < multerFiles.length; i++) {
      if (multerFiles[i].originalname === item) {
        return multerFiles[i].filename;
      }
    }
  });

  const includedFilenames = includedImages.map((item) => {
    for (let i = 0; i < multerFiles.length; i++) {
      if (multerFiles[i].originalname === item) {
        return multerFiles[i].filename;
      }
    }
  });

  let i = 0;
  const updatedBody = body.map((item) => {
    const { insert } = item;
    if (insert) {
      const { image } = insert;

      if (image && image.indexOf(process.env.DOMAIN) == -1) {
        image =
          process.env.DOMAIN + "/api/getImage" + "/" + includedFilenames[i];
        i++;
      }
      return item;
    }
  });

  return {
    updatedBody,
    excludedFilenames,
  };
};

module.exports = getUpdatedBodyAndExcludeFiles;
