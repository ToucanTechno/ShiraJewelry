const express = require('express');
let productsRouter = express.Router();
const productsModel = require('../model/products-model');

productsRouter.get('/:id([0-9]+)', (req, res) => {
  productsModel.getProduct(req.locals.dbSession, parseInt(req.params.id))
    .then((product) => {
      if (!product) {
        res.sendStatus(404);
      }
      res.json(product);
    });
});

productsRouter.get('/', (req, res) => {
  productsModel.getAllProducts(req.locals.dbSession)
    .then((products) => {
      res.json(products);
    });
});

productsRouter.post('/', (req, res) => {
  req.body.price = parseInt(req.body.price);
  const product = new productsModel.Product(
    null,
    req.body.name,
    req.body.description_he,
    req.body.description_en,
    req.body.display_name_he,
    req.body.display_name_en,
    req.body.image_path,
    req.body.price);
  productsModel.addProduct(req.locals.dbSession, product)
    .then((lastInsertedID) => {
      res.json({insertedID: lastInsertedID});
    });
});

productsRouter.post('/:id([0-9]+)', (req, res, next) => {
  if (req.body._method == 'PUT' || req.body._method == "DELETE") {
    req.method = req.body._method;
    next()
  }
  else {
    res.sendStatus(404);
  }
});

productsRouter.put('/:id([0-9]+)', (req, res) => {
  req.body.price = parseInt(req.body.price);
  const product = new productsModel.Product(
    null,
    req.body.name,
    req.body.description_he,
    req.body.description_en,
    req.body.display_name_he,
    req.body.display_name_en,
    req.body.image_path,
    req.body.price);
  productsModel.updateProductByID(req.locals.dbSession, parseInt(req.params.id), product)
    .then((affectedItemsCount) => {
      res.json({ affectedItemsCount: affectedItemsCount });
    })
});

productsRouter.delete('/:id([0-9]+)', (req, res) => {
  productsModel.deleteProductByID(req.locals.dbSession, parseInt(req.params.id))
    .then((affectedItemsCount) => {
      res.json({ affectedItemsCount: affectedItemsCount });
    })
});

module.exports = productsRouter;