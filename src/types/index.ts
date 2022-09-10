import { Schema } from "mongoose";

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
}
