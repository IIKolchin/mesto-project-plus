import { celebrate, Joi, Segments } from 'celebrate';

export const createCardValidate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
});

export const cardIdValidate = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});
