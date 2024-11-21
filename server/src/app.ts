import { InversifyExpressServer } from 'inversify-express-utils';
import * as express from 'express';
import { container } from './inversify.config';
import { errorHandler } from './middlewares/errorHandler.middleware';
import './controllers/salesOrder.controller';
import './controllers/masterProduct.controller';

import { connectDb } from './config/db.config';

const app = new InversifyExpressServer(container);

app.setConfig((app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
});

app.setErrorConfig((app) => {
  app.use(errorHandler);
});

connectDb();

export { app };
