import winston, { Logger } from 'winston';
import dotenv from 'dotenv';
dotenv.config();

const LOG_LEVEL = process.env.LOG_LEVEL;

export function getLogger(name: string, meta?: any): Logger {
  return winston.createLogger({
      level: LOG_LEVEL,
      format: winston.format.json(),
      transports: [new winston.transports.Console({ level: LOG_LEVEL })],
      defaultMeta: { class: name, ...meta },
  });
}