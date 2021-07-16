//Importing Controllers
const { googleLogin } = require("../../../controllers/auth");

const get = (router) => {
  router.post("/googleLogin", googleLogin);
};

module.exports = get;
