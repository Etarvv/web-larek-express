import { NextFunction, Request, Response } from 'express';
import { isCelebrateError } from 'celebrate';

interface IHttpError extends Error {
  statusCode?: number;
}

export default (err: IHttpError, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  if (isCelebrateError(err)) {
    const [validationError] = err.details.values();
    return res.status(400).send({ message: validationError.message });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  return res.status(statusCode).send({ message });
};
