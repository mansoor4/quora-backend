//Importing Controllers
const { getUser } = require("../../../controllers/user");

const get = (router, { isAuthenticated }) => {
  router.get("/getUser/:userId", isAuthenticated, getUser);
};

module.exports = get;
