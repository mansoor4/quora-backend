const express = require("express"),
  helmet = require("helmet"),
  cors = require("cors"),
  error = require("./utils/error"),
  connectWithMongoDB = require("./config/mongodb");

//Importing Sockets
const tagSocket = require("./socket/tagSocket");

//Server
const { server, app } = require("./config/server.js");

//Sockets
tagSocket();

// Global Middlewares
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});
app.use(cors());
app.use(express.json());
app.use(helmet());

//Import Routes
const { router } = require("./config/bull_board"),
  authRoute = require("./routes/auth"),
  userRoute = require("./routes/user"),
  questionRoute = require("./routes/question"),
  answerRoute = require("./routes/answer"),
  tagRoute = require("./routes/tag");

//Bull Dashborad Route
app.use("/admin/queues", router);

//Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/question", questionRoute);
app.use("/api/answer", answerRoute);
app.use("/api/tag", tagRoute);

//Route Not Found
app.use("/", (req, res, next) => {
  return next(error("Api not found", 404));
});

//Error handler Middleware
app.use("/", (error, req, res, next) => {
  console.log(error);
  const message = error.message || "Something went wrong";
  const status = error.status || 500;
  return res.status(status).json({
    error: error,
    message: message,
    status: status,
  });
});

// MongoDB conection And Server Running
connectWithMongoDB(server);
