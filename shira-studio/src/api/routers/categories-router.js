const express = require('express');
const categoriesModel = require('../model/categories-model');
const cors = require("cors");

let categoriesRouter = express.Router();
const SERVER_HOSTNAME = 'http://localhost:4201';

// TODO: Remove in Categoryion
categoriesRouter.use(cors({ origin: SERVER_HOSTNAME }));

categoriesRouter.use(express.json());

categoriesRouter.get('/:id([0-9]+)', (req, res) => {
  categoriesModel.getCategory(req.locals.dbSession, parseInt(req.params.id))
    .then((category) => {
      if (!category) {
        res.sendStatus(404);
      }
      res.json(category);
    });
});

categoriesRouter.get('/', (req, res) => {
  categoriesModel.getAllCategories(req.locals.dbSession)
    .then((categories) => {
      res.json(categories);
    });
});

categoriesRouter.post('/', (req, res) => {
  req.body.price = parseInt(req.body.price);
  const category = new categoriesModel.Category(
    req.locals.dbSession,
    undefined,
    req.body.name,
    req.body.description_he,
    req.body.description_en,
    req.body.display_name_he,
    req.body.display_name_en,
    req.body.image_path,
    req.body.parent_category_name);
  category.parentCategoryPromise.then(() => {
    categoriesModel.addCategory(req.locals.dbSession, category)
      .then((lastInsertedID) => {
        res.json({insertedID: lastInsertedID});
      });
  });
});

categoriesRouter.post('/:id([0-9]+)', (req, res, next) => {
  if (req.body._method == 'PUT' || req.body._method == "DELETE") {
    req.method = req.body._method;
    next()
  }
  else {
    res.sendStatus(404);
  }
});

categoriesRouter.put('/:id([0-9]+)', (req, res) => {
  req.body.price = parseInt(req.body.price);
  const category = new categoriesModel.Category(
    req.locals.dbSession,
    undefined,
    req.body.name,
    req.body.description_he,
    req.body.description_en,
    req.body.display_name_he,
    req.body.display_name_en,
    req.body.image_path,
    req.body.price);
  category.parentCategoryPromise.then(() => {
    categoriesModel.updateCategoryByID(req.locals.dbSession, parseInt(req.params.id), category)
      .then((affectedItemsCount) => {
        console.log(category);
        res.json({ affectedItemsCount: affectedItemsCount });
      })
  });
});

categoriesRouter.delete('/:id([0-9]+)', (req, res) => {
  categoriesModel.deleteCategoryByID(req.locals.dbSession, parseInt(req.params.id))
    .then((affectedItemsCount) => {
      res.json({ affectedItemsCount: affectedItemsCount });
    })
});

module.exports = categoriesRouter;
