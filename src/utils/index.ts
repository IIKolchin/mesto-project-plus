import { NextFunction } from 'express';
import { IError } from '../types';
import ConflictError from '../errors/conflict-err';
import BadRequestError from '../errors/not-found-err';

export const isURL = (str: string | URL) => {
  try {
    // eslint-disable-next-line no-new
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export const operationalErrorsHandler = (err: IError, next: NextFunction) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new BadRequestError('Переданы некорректные данные'));
  } else if (err.code === 11000) {
    next(new ConflictError('Ошибка авторизации'));
  } else {
    next(err);
  }
};
