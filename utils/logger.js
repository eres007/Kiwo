// Structured logging utility
import fs from 'fs';
import path from 'path';

const LOG_DIR = './logs';

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const levels = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

function formatLog(level, message, data = {}) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data,
    pid: process.pid,
  });
}

function writeLog(level, message, data) {
  const logEntry = formatLog(level, message, data);

  // Console output
  const color = {
    ERROR: '\x1b[31m', // Red
    WARN: '\x1b[33m', // Yellow
    INFO: '\x1b[36m', // Cyan
    DEBUG: '\x1b[35m', // Magenta
  };
  const reset = '\x1b[0m';

  console.log(`${color[level]}[${level}]${reset} ${message}`);

  // File output
  const logFile = path.join(LOG_DIR, `${level.toLowerCase()}.log`);
  fs.appendFileSync(logFile, logEntry + '\n');

  // Also write to combined log
  const combinedFile = path.join(LOG_DIR, 'combined.log');
  fs.appendFileSync(combinedFile, logEntry + '\n');
}

export const logger = {
  error: (message, data) => writeLog(levels.ERROR, message, data),
  warn: (message, data) => writeLog(levels.WARN, message, data),
  info: (message, data) => writeLog(levels.INFO, message, data),
  debug: (message, data) => {
    if (process.env.DEBUG === 'true') {
      writeLog(levels.DEBUG, message, data);
    }
  },
};

// Request logging middleware
export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'WARN' : 'INFO';

    logger[level.toLowerCase()](
      `${req.method} ${req.path}`,
      {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      }
    );
  });

  next();
}
