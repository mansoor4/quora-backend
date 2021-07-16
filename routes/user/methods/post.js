//Importing Controllers
const { createProfile } = require("../../../controllers/user");

const post = (router, { isAuthenticated, multerUpload }) => {
  router.post(
    "/createProfile/:userId",
    isAuthenticated,
    multerUpload,
    createProfile
  );
};

module.exports = post;
