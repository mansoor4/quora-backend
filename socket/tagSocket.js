const Tag = require("../database/models/tag"),
  sanitizeTags = require("../utils/sanitizeTags");

const tagSocket = (socket, io) => {
  socket.on("addTag", async (payload) => {
    try {
      const { tags, profileImage, name, username } = payload;
      const sanitizedTags = sanitizeTags(tags);
      if (sanitizedTags.length) {
        const newTag = {
          tags: sanitizedTags,
          user: { profileImage, name, username },
        };
        const tag = await Tag.create(newTag);
        io.emit("getTag", { tag: tag });
      }
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = tagSocket;
