const express = require('express');
let productsRouter = express.Router();
const productsModel = require('../model/products-model');

productsRouter.get('/:id([0-9]+)', (req, res) => {
  res.send('get product ' + req.params.id);
});

productsRouter.get('/', (req, res) => {
  console.log(this);
  console.log(productsModel.getAllProducts(this.session))
  res.send('get products');
});

productsRouter.post('/', (req, res) => {
  res.send('posting a product in /products')
});

productsRouter.put('/:id([0-9]+)', (req, res) => {
  res.send('Updating product ' + req.params.id)
});

productsRouter.delete('/:id([0-9]+)', (req, res) => {
  res.send('Deleting product ' + req.params.id)
});

module.exports = productsRouter;
