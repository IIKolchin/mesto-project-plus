import { Request, Response } from 'express';
import isURL from '../utils/index';
import User from '../models/user';
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR,
} from '../utils/constants';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send(users))
  .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));

export const getUserById = (req: Request, res: Response) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({
          message:
            'Переданы некорректные данные для запрашиваемого пользователя',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

export const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  const id = req.user._id;
  if (!isURL(avatar)) {
    return res.status(BAD_REQUEST_ERROR).send({
      message: 'Переданы некорректные данные при обновлении аватара',
    });
  }
  return User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь не найден' });
      }

      return res.send(user);
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};
