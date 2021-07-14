//Connect Socket
const connectSocket = require("../config/socket");

//Sockets
const tagSocket = require("./tagSocket"),
  chatSocket = require("./chatSocket");

const indexSocket = () => {
  connectSocket((socket, io) => {
    tagSocket(socket, io);
    chatSocket(socket, io);
  });
};

module.exports = indexSocket;
