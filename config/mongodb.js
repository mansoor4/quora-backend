const mongoose = require("mongoose"),
  environmentVariables = require("./environmentVariables");

//Configure Environment variables
environmentVariables();

const connectWithMongoDB = async (app) => {
  try {
    await mongoose.connect("mongodb://localhost/quora", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
    await app.listen(process.env.PORT);
    console.log(`Sever started at PORT ${process.env.PORT}`);
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectWithMongoDB;
