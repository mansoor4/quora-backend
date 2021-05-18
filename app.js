const express = require("express"),
  app = express(),
  cors = require("cors"),
  helmet = require("helmet"),
  error = require("./utils/error"),
  connectWithMongoDB = require("./config/mongodb");

// Global Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

//Import Routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

//Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

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
  });
});

// MongoDB conection And Server Running
connectWithMongoDB(app);
