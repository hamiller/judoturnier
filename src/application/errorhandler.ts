import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'routing-controllers';
import { getLogger } from './logger';

const logger = getLogger('errorHandler');

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
      return next(err);
  }
  logger.error('An ERROR occured: ' + err.message, { err: err });

  if (err instanceof HttpError) {
      res.status(err.httpCode).send();
  } else {
      res.status(500).send({ error: 'Ein interner Serverfehler ist aufgetreten' });
  }
};
