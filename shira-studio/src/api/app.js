const express = require('express');
const productsRouter = require('./routers/products-router');
const categoriesRouter = require('./routers/categories-router');
const DBSession = require('./model/db-session');
const fileUploadRouter = require("./routers/file-upload-router");

const app = express()
const PORT = 3000

DBSession.build().then((dbSession) => {
  // TODO: Add authentication middleware that validates cookies, except for the login/signup requests

  app.use('/products', (req, res, next) => {
    req.locals = { dbSession: dbSession };
    productsRouter(req, res, next);
  });

  app.use('/categories', (req, res, next) => {
    req.locals = { dbSession: dbSession };
    categoriesRouter(req, res, next);
  });

  app.use('/upload', fileUploadRouter);

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
});
