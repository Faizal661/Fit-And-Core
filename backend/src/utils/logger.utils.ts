import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});


const logger = winston.createLogger({
  level: "info", 
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    logFormat
  ),
  transports: [
    // Log to a file and rotate daily
    new DailyRotateFile({
      filename: "logs/All_Logs-%DATE%.log",
      datePattern: "DD-MM-YYYY",
      maxSize: "20m",
      maxFiles: "14d",
      level: "info",
    }),

    // Log errors to a separate file
    new DailyRotateFile({
      filename: "logs/Errors-%DATE%.log",
      datePattern: "DD-MM-YYYY",
      maxSize: "10m",
      maxFiles: "30d",
      level: "error",
    }),

    // Also log to console in development
    // new winston.transports.Console({
    //   format: winston.format.combine(
    //     winston.format.colorize(),
    //     winston.format.simple()
    //   ),
    // }),
  ],
});

export default logger;
