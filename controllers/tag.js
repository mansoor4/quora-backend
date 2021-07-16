const User = require("../database/models/user"),
  Tag = require("../database/models/tag");

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

  getAllAdminTags: async (req, res, next) => {
    try {
      const tags = await Tag.find();

      return res.json({
        tags,
      });
    } catch (err) {
      return next(err);
    }
  },

  addTags: async (req, res, next) => {
    try {
      let { tags, tagId } = req.body;
      await Tag.findByIdAndRemove(tagId);

      const result = await User.addTags(tags);
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
