//Importing Controllers
const { connectUser } = require("../../../../controllers/user");

const put = (router, { isAuthenticated }) => {
  router.put("/connectUser/:userId", isAuthenticated, connectUser);
};

module.exports = put;
