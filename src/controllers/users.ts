import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isURL, operationalErrorsHandler } from '../utils/index';
import User from '../models/user';
import { IUserRequest, SessionRequest } from '../types';
import NotFoundError from '../errors/not-found-err';
import BadRequestError from '../errors/bad-request-err';
import ConflictError from '../errors/conflict-err';

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const jwtToken = jwt.sign({ _id: user._id }, 'strong-secret', { expiresIn: '7d' });
      res.cookie('jwt', jwtToken, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({
        token: jwtToken,
      });
    })
    .catch(next);
};

export const getCurrentUser = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { _id } = req.user as IUserRequest;
  return User.findById(_id)
    .then((user) => res.send(user))
    .catch(next);
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send(users))
  .catch(next);

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      operationalErrorsHandler(err, next);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.find({ email })
    .then((user) => {
      if (user.length > 0) {
        throw new ConflictError('Пользователь уже существует');
      } else {
        return bcrypt.hash(password, 10)
          .then((hash: string) => User.create({
            name, about, avatar, email, password: hash,
          }))
          .then((newUser) => res.send(newUser))
          .catch((err) => {
            operationalErrorsHandler(err, next);
          });
      }
    }).catch(next);
};

export const updateUser = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const { _id } = req.user as IUserRequest;

  return User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      operationalErrorsHandler(err, next);
    });
};

export const updateAvatar = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const { _id } = req.user as IUserRequest;
  if (!isURL(avatar)) {
    throw new BadRequestError('Переданы некорректные данные при обновлении аватара');
  }
  return User.findByIdAndUpdate(
    _id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch(next);
};
