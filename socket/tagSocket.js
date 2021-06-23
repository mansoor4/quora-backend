const connectSocket = require("../config/socket"),
  Tag = require("../models/tag");

const tagSocket = () => {
  connectSocket((socket, io) => {
    socket.on("addTag", async (payload) => {
      try {
        const { tags, profileImage, username } = payload;
        const newTag = { tags: tags, user: { profileImage, username } };
        const tag = await Tag.create(newTag);
        io.emit("getTag", { tag: tag });
      } catch (err) {
        console.log(err);
      }
    });
  });
};

module.exports = tagSocket;
