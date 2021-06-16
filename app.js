const express = require("express"),
  app = express(),
  helmet = require("helmet"),
  error = require("./utils/error"),
  connectWithMongoDB = require("./config/mongodb");

// Global Middlewares
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});
app.use(express.json());
app.use(helmet());

//Import Routes
const { router } = require("./config/bull_board"),
  authRoute = require("./routes/auth"),
  userRoute = require("./routes/user"),
  tagRoute = require("./routes/tag");

//Bull Dashborad Route
app.use("/admin/queues", router);

//Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/tag", tagRoute);

//Route Not Found
app.use("/", (req, res, next) => {
  return next(error("Api not found", 404));
});

//Error handler Middleware
app.use("/", (error, req, res, next) => {
  const message = error.message || "Something went wrong";
  const status = error.status || 500;
  return res.status(status).json({
    error: error,
    message: message,
    status: status,
  });
});

// MongoDB conection And Server Running
connectWithMongoDB(app);
