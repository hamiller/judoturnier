import winston, { Logger } from 'winston';
import dotenv from 'dotenv';
dotenv.config();

const LOG_LEVEL = process.env.LOG_LEVEL;

export function getLogger(name: string, meta?: any): Logger {
  return winston.createLogger({
      level: LOG_LEVEL,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, data }) => {
          // Hier formatieren wir das Haupt-JSON und das innere JSON mit prettyPrint.
          const innerJson = JSON.stringify(data, null, 2); // Hier wird prettyPrint auf das innere JSON angewendet.
          if (innerJson) return `${timestamp} [${level}]: ${message}\nvvv\n${innerJson}\n---`;
          else return `${timestamp} [${level}]: ${message}`;
        })
      ),
      transports: [new winston.transports.Console({ level: LOG_LEVEL })],
      defaultMeta: { class: name, ...meta },
  });
}