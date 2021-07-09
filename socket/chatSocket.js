const connectSocket = require("../config/socket");

const chatSocket = () => {
  connectSocket((socket, io) => {});
};

module.exports = chatSocket;
