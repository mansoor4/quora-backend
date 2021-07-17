//Import Packages
const multer = require("multer");

//Import Utils
const error = require("../utils/error");

//Import Configs
const upload = require("../config/multer");

multerUpload = (req, res, next) => {
  upload.array("image")(req, res, (err) => {
    const now = err && err.code == "UnknownEndpoint" ? true : false;

    // internet disconnect
    if (now) {
      return next(error("Internet disconnected", 500));
    }

    // multer error
    if (err instanceof multer.MulterError) {
      return next(error(err.message, 422));
    }

    //Other Unknown Error
    if (err) {
      return next(err);
    }

    return next();
  });
};

module.exports = multerUpload;
