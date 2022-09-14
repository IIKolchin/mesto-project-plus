import { Request, Response, NextFunction } from 'express';
import ForbiddenError from '../errors/forbidden-err';
import { isURL, operationalErrorsHandler } from '../utils/index';
import Card from '../models/card';
import { IUserRequest, SessionRequest } from '../types';
import BadRequestError from '../errors/bad-request-err';
import NotFoundError from '../errors/not-found-err';

export const getCards = (_req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

export const createCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const { _id } = req.user as IUserRequest;
  if (!isURL(link)) {
    throw new BadRequestError('Переданы некорректные данные при создании карточки');
  }
  return Card.create({ name, link, owner: _id })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      operationalErrorsHandler(err, next);
    });
};

export const deleteCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { _id } = req.user as IUserRequest;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      if (card.owner.toString() === _id.toString()) {
        return card.remove().then(() => res.send({ data: card })).catch((err) => {
          operationalErrorsHandler(err, next);
        });
      }
      throw new ForbiddenError('Доступ к запрошенному ресурсу запрещен');
    })
    .catch((err) => {
      operationalErrorsHandler(err, next);
    });
};

export const likeCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { _id } = req.user as IUserRequest;
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res.send(card);
    })
    .catch((err) => {
      operationalErrorsHandler(err, next);
    });
};

export const dislikeCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  const { _id } = req.user as IUserRequest;
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res.send(card);
    })
    .catch((err) => {
      operationalErrorsHandler(err, next);
    });
};
