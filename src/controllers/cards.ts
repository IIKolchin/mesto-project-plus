import { Request, Response } from "express";
import isURL from "../utils/index";
import Card from "../models/card";
import {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
} from "../utils/constants";

export const getCards = (_req: Request, res: Response) =>
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: "Произошла ошибка" })
    );

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const id = req.user._id;
  if (!isURL(link)) {
    return res.status(BAD_REQUEST_ERROR).send({
      message: "Переданы некорректные данные при создании карточки",
    });
  }
  return Card.create({ name, link, owner: id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message.includes("card validation failed")) {
        return res.status(BAD_REQUEST_ERROR).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Произошла ошибка" });
    });
};

export const deleteCard = (req: Request, res: Response) =>
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Запрашиваемая карточка не найдена" });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.message.includes("Cast to ObjectId")) {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Переданы некорректные данные для снятия лайка" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Произошла ошибка" });
    });

export const likeCard = (req: Request, res: Response) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.message.includes("Cast to ObjectId")) {
        return res.status(BAD_REQUEST_ERROR).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Произошла ошибка" });
    });

export const dislikeCard = (req: Request, res: Response) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.message.includes("Cast to ObjectId")) {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Переданы некорректные данные для снятия лайка" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Произошла ошибка" });
    });
