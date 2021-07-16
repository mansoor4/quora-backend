const express = require("express"),
  router = express.Router();

//Importing Global Methods
const globalGet = require("./methods/get");

//Global Methods
globalGet(router);

module.exports = router;
