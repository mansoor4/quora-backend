//Importing Controllers
const { addTags } = require("../../../controllers/tag");

const post = (router, { isAuthenticated, isAdmin }) => {
  router.post("/addTagByName/:userId", isAuthenticated, isAdmin, addTags);
};

module.exports = post;
