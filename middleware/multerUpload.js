const upload = require("../config/multer"),
  multer = require("multer"),
  error = require("../utils/error");

multerUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
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
