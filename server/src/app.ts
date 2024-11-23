import { InversifyExpressServer } from 'inversify-express-utils';
import * as express from 'express';
import { container } from './inversify.config';
import { errorHandler } from './middlewares/errorHandler.middleware';
import './controllers/salesOrder.controller';
import './controllers/masterProduct.controller';
import './controllers/integration.controller';
import './controllers/masterProductInt.controller';

import { connectDb } from './config/db.config';
import cors from 'cors';

const app = new InversifyExpressServer(container);

app.setConfig((app) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
});

app.setErrorConfig((app) => {
  app.use(errorHandler);
});

connectDb();

export { app };
