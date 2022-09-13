import { Model, Schema, Document } from 'mongoose';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) =>
  Promise<Document<unknown, any, IUser>>
}

export interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

export interface IUserRequest extends Request {
    _id: Schema.Types.ObjectId;
}
