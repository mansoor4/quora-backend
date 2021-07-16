//Importing Controllers
const { deleteBookmark } = require("../../../../controllers/user");

const _delete = (router, { isAuthenticated }) => {
  router.delete("/deleteBookmark/:userId", isAuthenticated, deleteBookmark);
};

module.exports = _delete;
