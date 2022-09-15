import { model, Schema } from 'mongoose';
import { ICard } from '../types';

const cardSchema = new Schema<ICard>(
  {
    name: {
      type: String,
      required: [true, 'Обязательное поле'],
      minlength: [2, 'Должно быть не менее 2 символов'],
      maxlength: [30, 'Должно быть не более 30 символов'],
    },
    link: {
      type: String,
      required: [true, 'Обязательное поле'],
      validate: {
        validator(v: string) {
          return /^(http|https):\/\/(?:www\.|(?!www))[^ "]+\.([a-z]{2,})/.test(v);
        },
        message: 'URL не соответствует формату',
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Обязательное поле'],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default model<ICard>('card', cardSchema);
