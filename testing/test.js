const { createLogger, format, transports } = require("winston");
const { json, timestamp, combine } = format;
const { LoggingWinston } = require("@google-cloud/logging-winston");

const loggingWinston = new LoggingWinston({
  projectId: "quora-313910",
});

const logger = createLogger({
  transports: [new transports.Console(), loggingWinston],
});

logger.error("kuch galat hora hai bhaio");
logger.info("Hi there file how are you");
