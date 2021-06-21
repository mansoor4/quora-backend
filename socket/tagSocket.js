const connectSocket = require("../config/socket"),
  Tag = require("../models/tag"),
  error = require("../utils/error");

const tagSocket = () => {
  connectSocket((socket, io) => {
    //1. emit the addTag event from app side
    //2. listen the addTag event on server and store tag data in database
    //3. emit getTag event from server which was received by admin side
    //4. listen getTag event on admin side
    socket.on("addTag", async (payload) => {
      try {
        const tag = await Tag.create(payload);
      } catch (err) {
        console.log(err);
      }
    });
  });
};

module.exports = tagSocket;
