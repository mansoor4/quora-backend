const fs = require("fs");

const chatSocket = (socket, io) => {
  socket.on("connectChat", ({ userId, toUserId }) => {
    // 1.user emit connectChat event. if conenction between user is present than user join the connectedId room else
    // first made the connectedId than join

    // 2. emit connectedToChat event to client
    //3 connectedToChat is executing store all the messages in array at client side

    // 3.To uplaod image client send buffer data to server and server write that data to the file and
    // in aws we have "upload" method to uplaod buffer as a file

    socket.on("message", (payload) => {
      const { data, filename } = payload;
      fs.writeFile(path.join(__dirname, "uploads", filename), data, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Done");
      });
    });
  });
};

module.exports = chatSocket;

//https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender#:~:text='myNamespace').-,emit('message'%2C%20'gg')%3B%20%2F%2Fsending,that%20sent%20the%20message%20socket.

// https://stackoverflow.com/questions/6563885/socket-io-how-do-i-get-a-list-of-connected-sockets-clients

//https://stackoverflow.com/questions/13807339/upload-a-binary-file-to-s3-using-aws-sdk-for-node-js

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
