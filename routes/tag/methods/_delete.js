//Importing Controllers
const { deleteTagByName } = require("../../../controllers/tag");

const _delete = (router, { isAuthenticated, isAdmin }) => {
  router.delete(
    "/deleteTagByName/:userId",
    isAuthenticated,
    isAdmin,
    deleteTagByName
  );
};

module.exports = _delete;
