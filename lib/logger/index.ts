import winston from "winston";

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.colorize(),
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);

export default logger;