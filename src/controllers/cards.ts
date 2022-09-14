import { Request, Response } from 'express';
import isURL from '../utils/index';
import Card from '../models/card';
import {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
} from '../utils/constants';
import { IUserRequest, SessionRequest } from '../types';

export const getCards = (_req: Request, res: Response) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));

export const createCard = (req: SessionRequest, res: Response) => {
  const { name, link } = req.body;
  const { _id } = req.user as IUserRequest;
  if (!isURL(link)) {
    return res.status(BAD_REQUEST_ERROR).send({
      message: 'Переданы некорректные данные при создании карточки',
    });
  }
  return Card.create({ name, link, owner: _id })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

export const deleteCard = (req: SessionRequest, res: Response) => {
  const { _id } = req.user as IUserRequest;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      }
      if (card.owner.toString() === _id.toString()) {
        return card.remove().then(() => res.send({ data: card })).catch(() => {
          res.status(403).send({ message: 'Доступ к запрошенному ресурсу запрещен' });
        });
      }
      return res.status(403).send({ message: 'Доступ к запрошенному ресурсу запрещен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message: 'Переданы некорректные данные для удаления карточки',
          });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

export const likeCard = (req: SessionRequest, res: Response) => {
  const { _id } = req.user as IUserRequest;
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};

export const dislikeCard = (req: SessionRequest, res: Response) => {
  const { _id } = req.user as IUserRequest;
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка' });
    });
};
