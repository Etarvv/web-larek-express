import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { DB_ADDRESS, ORIGIN_ALLOW, PORT } from './config';
import routes from './routes';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';

const app = express();

app.use(requestLogger);
app.use(cors({ origin: ORIGIN_ALLOW }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.use(errorLogger);
app.use(errorHandler);

const start = async () => {
  await mongoose.connect(DB_ADDRESS);
  app.listen(PORT, () => process.stdout.write(`Сервер запущен на порту ${PORT}\n`));
};

start().catch((error) => {
  process.stderr.write(`Не удалось запустить сервер: ${error.message}\n`);
  process.exit(1);
});
