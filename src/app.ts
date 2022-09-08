// app.ts — входной файл
import express from "express";
import mongoose from "mongoose";

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу MongoiDB
mongoose.connect("mongodb://localhost:27017/mestodb");

// подключаем мидлвары, роуты и всё остальное...

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
