import { model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from '../types';
import UnauthorizedError from '../errors/unauthorized-err';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Обязательное поле'],
      minlength: [2, 'Должно быть не менее 2 символов'],
      maxlength: [30, 'Должно быть не более 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      required: [true, 'Обязательное поле'],
      minlength: [2, 'Должно быть не менее 2 символов'],
      maxlength: [200, 'Должно быть не более 200 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      required: [true, 'Обязательное поле'],
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(v: string) {
          return /^(http|https):\/\/(?:www\.|(?!www))[^ "]+\.([a-z]{2,})/.test(v);
        },
        message: 'URL не соответствует формату',
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
});

export default model<IUser, UserModel>('user', userSchema);
