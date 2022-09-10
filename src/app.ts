import express, { Request, Response } from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users";
import cardsRouter from "./routes/cards";

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use((req: Request, res: Response, next) => {
  req.user = {
    _id: "631a07baa31e2106a27a9876",
  };

  next();
});

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.listen(PORT);
