import { model, Schema } from 'mongoose';
import { IUser } from '../types';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Обязательное поле'],
      minlength: [2, 'Должно быть не менее 2 символов'],
      maxlength: [30, 'Должно быть не более 30 символов'],
    },
    about: {
      type: String,
      required: [true, 'Обязательное поле'],
      minlength: [2, 'Должно быть не менее 2 символов'],
      maxlength: [200, 'Должно быть не более 200 символов'],
    },
    avatar: {
      type: String,
      required: [true, 'Обязательное поле'],
    },
  },
  { versionKey: false },
);

export default model<IUser>('user', userSchema);
