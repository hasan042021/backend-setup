import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";
import DailyRotateFile from "winston-daily-rotate-file";

// Define the log file location
const logFilePath = path.join(process.cwd(), "src", "logs", "error.log");

// Ensure the logs directory exists
const logsDir = path.dirname(logFilePath);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || "debug", // Make log level configurable
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add timestamp
    format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`; // Format log output
    })
  ),
  transports: [
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m", // Max 10MB per file
      maxFiles: "14d", // Keep logs for 14 days
    }),
    new transports.Console(), // Show logs in the terminal (optional)
  ],
});

// Test log
logger.debug("Debug log test!");

export default logger;
