import express from 'express';
import { productsRouter } from './routers/products-router';
import categoriesRouter from './routers/categories-router';
import DBSession from './model/db-session';
import fileUploadRouter from './routers/file-upload-router';

const app = express();
const PORT = 3000;

DBSession.build().then((dbSession) => {
  // TODO: Add authentication middleware that validates cookies, except for the login/signup requests

  app.use('/products', (req, res, next) => {
    req.locals = { dbSession };
    productsRouter(req, res, next);
  });

  app.use('/categories', (req, res, next) => {
    req.locals = { dbSession };
    categoriesRouter(req, res, next);
  });

  app.use('/upload', fileUploadRouter);

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
});
