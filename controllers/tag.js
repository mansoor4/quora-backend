const User = require("../models/user");

//Controllers
module.exports = {
  getAllTags: async (req, res, next) => {
    try {
      const tags = await User.getTags();
      return res.json({
        tags: tags,
      });
    } catch (err) {
      return next(err);
    }
  },

  addTagByName: async (req, res, next) => {
    try {
      let { tagName } = req.body;
      tagName = tagName.trim();

      const result = await User.addTag(tagName);
      if (result) {
        return res.json({
          message: "Tags add successfully",
        });
      }
    } catch (err) {
      return next(err);
    }
  },

  deleteTagByName: async (req, res, next) => {
    try {
      let { tagName } = req.body;
      tagName = tagName.trim();

      const result = await User.deleteTag(tagName);

      if (result) {
        res.json({
          message: "Tag Deleted Sucessfully",
        });
      }
    } catch (err) {
      return next(err);
    }
  },
};
