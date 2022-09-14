/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { IError } from '../types';
import { INTERNAL_SERVER_ERROR } from '../utils/constants';

export default function errorHandler(
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
}
