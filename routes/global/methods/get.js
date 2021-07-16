//Importing Controllers
const { getImage } = require("../../../controllers/global");

const get = (router) => {
  router.get("/getImage/:imageName", getImage);
};

module.exports = get;
