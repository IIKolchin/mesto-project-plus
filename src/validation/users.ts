import { celebrate, Joi, Segments } from 'celebrate';

export const getUserByIdValidate = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

export const updateUserValidate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

export const updateAvatarValidate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().domain(),
  }),
});

export const loginValidate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

export const createUserValidate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().domain(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }).unknown(true),
});
