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

// Helper to format messages with multiple arguments
function formatMessage(info: any) {
  // Combine message and splat (extra args)
  const splat = info[Symbol.for('splat')] || [];
  const allArgs = [info.message, ...splat];
  return allArgs.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))).join(' ');
}

// Create the logger
const logger = createLogger({
  level: 'debug', // Enable all log levels
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf((info) => {
      const color = info.level === 'error' ? 'red' : info.level === 'warn' ? 'yellow' : info.level === 'debug' ? 'cyan' : 'white';
      const msg = formatMessage(info);
      const coloredMessage = chalk[color](`[${info.level}] ${info.timestamp} - ${msg}`);
      return coloredMessage;
    }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => {
          const color =
            info.level === 'error' ? 'red' : info.level === 'warn' ? 'yellow' : info.level === 'debug' ? 'cyan' : 'white';
          const msg = formatMessage(info);
          const coloredMessage = chalk[color](`[${info.level}] ${info.timestamp} - ${msg}`);
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
