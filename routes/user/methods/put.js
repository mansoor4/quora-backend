//Importing Controllers
const { updateProfile } = require("../../../controllers/user");

const put = (router, { isAuthenticated, multerUpload }) => {
  router.put(
    "/updateProfile/:userId",
    isAuthenticated,
    multerUpload,
    updateProfile
  );
};

module.exports = put;
