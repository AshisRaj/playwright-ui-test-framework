import chalk from 'chalk';
import * as fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Define log directory and file paths
const logDir = path.resolve(__dirname, '../../artifacts/logs');
const logFileName = 'playwright.log';

// Ensure the logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create the logger
const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => {
      const color = level === 'error' ? 'red' : level === 'warn' ? 'yellow' : 'white';
      const coloredMessage = chalk[color](`[${level}] ${timestamp} - ${message}`);
      return coloredMessage;
    }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp }) => {
          const color = level === 'error' ? 'red' : level === 'warn' ? 'yellow' : 'white';
          const coloredMessage = chalk[color](`[${level}] ${timestamp} - ${message}`);
          return coloredMessage;
        }),
      ),
    }),
    new DailyRotateFile({
      dirname: logDir,
      filename: logFileName,
      datePattern: 'YYYY-MM-DD',
      maxSize: '15m',
      maxFiles: '14d', // Keep logs for 14 days
    }),
  ],
});

export default logger;
