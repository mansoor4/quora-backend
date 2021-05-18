const multer = require("multer"),
  uuid = require("uuid/v4"),
  error = require("../utils/error.js");

//Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    return cb(null, uuid() + "-" + file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    return cb(null, true);
  }
  return cb(
    error("File type not supported, Must be jpg, jpeg or png type", 422),
    false
  );
};

const uplaod = multer({
  storage: storage,
  fileFilter: filter,
  limits: {
    fileSize: 1024 * 1024,
  },
});

module.exports = uplaod;
