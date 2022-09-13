import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isURL from '../utils/index';
import User from '../models/user';
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR,
} from '../utils/constants';
import { IUserRequest, SessionRequest } from '../types';

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

export const getCurrentUser = (req: SessionRequest, res: Response) => {
  const { _id } = req.user as IUserRequest;
  return User.findById(_id)
    .then((user) => res.send(user))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

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
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      name, about, avatar, email, password: hash,
    }))
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

export const updateUser = (req: SessionRequest, res: Response) => {
  const { name, about } = req.body;
  const { _id } = req.user as IUserRequest;

  return User.findByIdAndUpdate(
    _id,
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

export const updateAvatar = (req: SessionRequest, res: Response) => {
  const { avatar } = req.body;
  const { _id } = req.user as IUserRequest;
  if (!isURL(avatar)) {
    return res.status(BAD_REQUEST_ERROR).send({
      message: 'Переданы некорректные данные при обновлении аватара',
    });
  }
  return User.findByIdAndUpdate(
    _id,
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
