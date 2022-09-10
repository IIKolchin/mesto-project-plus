import { Request, Response } from "express";
import isURL from "../utils/index";
import Card from "../models/card";

export const getCards = (_req: Request, res: Response) =>
  Card.find({}, { __v: 0 })
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));

export const createCard = (req: any, res: Response) => {
  const { name, link } = req.body;
  const id = req.user._id;
  if (!isURL(link))
    return res.status(400).send({
      message: "Переданы некорректные данные при создании карточки",
    });
  return Card.create({ name, link, owner: id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message.includes("card validation failed"))
        return res.status(400).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      return res.status(500).send({ message: err.message });
    });
};

export const deleteCard = (req: Request, res: Response) =>
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card)
        return res
          .status(404)
          .send({ message: "Запрашиваемая карточка не найдена" });
      return res.send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: err.message }));

export const likeCard = (req: any, res: Response) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card)
        return res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки" });
      return res.send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));

export const dislikeCard = (req: any, res: Response) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card)
        return res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки" });
      return res.send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
