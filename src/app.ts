import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import errorHandler from './middlewares/error-handler';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { createUserValidate, loginValidate } from './validation/users';
import { PORT } from './utils/constants';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', loginValidate, login);
app.post('/signup', createUserValidate, createUser);
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
