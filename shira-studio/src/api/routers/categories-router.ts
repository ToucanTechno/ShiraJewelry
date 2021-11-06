import express from 'express';
import * as categoriesModel from '../model/categories-model.js';
import cors from 'cors';

export const categoriesRouter = express.Router();
const SERVER_HOSTNAME = 'http://localhost:4201';
const IDRegex = ':id([0-9]+)';

// TODO: Remove in Production
categoriesRouter.use(cors({ origin: SERVER_HOSTNAME }));

categoriesRouter.use(express.json());

categoriesRouter.get('/' + IDRegex, (req, res) => {
  categoriesModel.getCategory(req.locals.dbSession, parseInt(req.params.id, 10))
    .then((category) => {
      if (!category) {
        res.sendStatus(404);
      }
      res.json(category);
    });
});

categoriesRouter.get('/' + IDRegex + '/subcategories', (req, res) => {
  categoriesModel.getSubcategories(req.locals.dbSession, parseInt(req.params.id, 10))
    .then((subcategories) => {
      if (subcategories === undefined || subcategories === null) {
        res.sendStatus(404);
        return;
      }
      res.json(subcategories);
      return;
    });
});

categoriesRouter.get('/', (req, res) => {
  categoriesModel.getAllCategories(req.locals.dbSession)
    .then((categories) => {
      res.json(categories);
    });
});

categoriesRouter.post('/', (req, res) => {
  prepareCategoryRequest(req);
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
      }).catch((err) => {
        res.status(400).send('Failed adding category');
    });
  });
});

categoriesRouter.post('/' + IDRegex, (req, res, next) => {
  if (req.body._method === 'PUT' || req.body._method === 'DELETE') {
    req.method = req.body._method;
    next();
  }
  else {
    res.sendStatus(404);
  }
});

categoriesRouter.put('/' + IDRegex, (req, res) => {
  prepareCategoryRequest(req);
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
    categoriesModel.updateCategoryByID(req.locals.dbSession, parseInt(req.params.id, 10), category)
      .then((affectedItemsCount) => {
        res.json({ affectedItemsCount });
      }).catch((err) => {
        res.status(400).send('Failed updating category');
    });
  });
});

categoriesRouter.delete('/' + IDRegex, (req, res) => {
  categoriesModel.deleteCategoryByID(req.locals.dbSession, parseInt(req.params.id, 10))
    .then((affectedItemsCount) => {
      res.json({ affectedItemsCount });
    });
});

function prepareCategoryRequest(req): void {
  if (req.body.description_he === undefined) {
    req.body.description_he = '';
  }
  if (req.body.description_en === undefined) {
    req.body.description_en = '';
  }
}
