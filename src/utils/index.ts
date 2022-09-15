import { Response, NextFunction } from 'express';
import { IError } from '../types';
import ConflictError from '../errors/conflict-err';
import BadRequestError from '../errors/not-found-err';

export const operationalErrorsHandler = (err: IError, next: NextFunction) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new BadRequestError('Переданы некорректные данные'));
  } else if (err.code === 11000) {
    next(new ConflictError('Ошибка авторизации'));
  } else {
    next(err);
  }
};

export const handleAuthError = (res: Response) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};
