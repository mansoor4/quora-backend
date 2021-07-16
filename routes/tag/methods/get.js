//Importing Controllers
const { getAllTags, getAllAdminTags } = require("../../../controllers/tag");

const get = (router, { isAuthenticated, isAdmin }) => {
  router.get("/getAlltags", isAuthenticated, getAllTags);

  router.get(
    "/getAllAdminTags/:userId",
    isAuthenticated,
    isAdmin,
    getAllAdminTags
  );
};

module.exports = get;
