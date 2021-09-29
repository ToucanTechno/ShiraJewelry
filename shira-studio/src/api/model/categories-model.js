const mysqlx = require('@mysql/xdevapi');

class Category {
  constructor(dbSession,
              categoryID,
              categoryName,
              descriptionHE,
              descriptionEN,
              displayNameHE,
              displayNameEN,
              imagePath,
              parentCategoryName) {
    this.categoryID = categoryID;
    this.categoryName = categoryName;
    this.descriptionHE = descriptionHE;
    this.descriptionEN = descriptionEN;
    this.displayNameHE = displayNameHE;
    this.displayNameEN = displayNameEN;
    this.imagePath = imagePath;
    this.parentCategoryPromise = getCategoryByName(dbSession, parentCategoryName).then((category) => {
      this.parentCategoryID = (category === undefined) ? null : category[0];  // Gets category ID if found
    });
  }
};

function getAllCategories(dbSession, count = 10, offset = 0) {
  const table = dbSession.getTable('categories');
  // TODO: add limit: return table.select().limit(count, offset).execute()
  return table.select().execute()
    .then((res) => {
      let entries = res.fetchAll();
      return entries.map((data) => {
        return {
          id: data[0],
          name: data[1],
          descriptionHE: data[2],
          descriptionEN: data[3],
          displayNameHE: data[4],
          displayNameEN: data[5],
          imagePath: data[6],
          parentCategoryID: data[7],
          isVisible: data[8]
        };
      })
    });
}

function getCategory(dbSession, categoryId) {
  const table = dbSession.getTable('categories');
  return table.select().where('id = :id').bind('id', categoryId).execute()
    .then((res) => {
      const entry = res.fetchOne();
      const parentId = entry[7];
      // If parentId is null, call where which will find no parent, because the code is simpler like that
      return table.select('name').where('id = :id').bind('id', parentId).execute()
        .then((res) => {
          const parentEntry = res.fetchOne();
          return {
            id: entry[0],
            name: entry[1],
            descriptionHE: entry[2],
            descriptionEN: entry[3],
            displayNameHE: entry[4],
            displayNameEN: entry[5],
            imagePath: entry[6],
            parentCategoryID: entry[7],
            isVisible: entry[8],
            parentCategoryName: (parentEntry) ? parentEntry[0] : '-'
          };
        })
    });
}

function getCategoryByName(dbSession, categoryName) {
  if (categoryName === undefined) {
    return new Promise((resolve, reject) => resolve(undefined));
  }
  const table = dbSession.getTable('categories');
  return table.select().where('name = :name').bind('name', categoryName).execute()
    .then((res) => {
      let result = res.fetchOne();
      return result;
    })
    .catch((error) => console.error(error));
}

function addCategory(dbSession, category) {
  // TODO: Validate there are no parent category circles
  let table = dbSession.getTable('categories');
  return table.insert(
    'name', 'description_he', 'description_en', 'display_name_he', 'display_name_en', 'image_path', 'parent_category_id')
    .values(
      category.categoryName,
      category.descriptionHE,
      category.descriptionEN,
      category.displayNameHE,
      category.displayNameEN,
      category.imagePath,
      category.parentCategoryID)
    .execute()
    .then((res) => {
      if (res.getAffectedItemsCount() == 0) {
        throw "No items were added"
      }
      return res.getAutoIncrementValue();
    }).catch((err) => {
      console.error("Failed adding Category:", category);
      console.error("Error: ", err)
      throw "Failed adding category";
    });
}

function updateCategoryByID(dbSession, categoryId, newCategory) {
  // TODO: Validate there are no parent category circles
  let table = dbSession.getTable('categories');
  return table.update()
    .set('name', newCategory.categoryName)
    .set('description_he', newCategory.descriptionHE)
    .set('description_en', newCategory.descriptionEN)
    .set('display_name_he', newCategory.displayNameHE)
    .set('display_name_en', newCategory.displayNameEN)
    .set('image_path', newCategory.imagePath)
    .set('parent_category_id', newCategory.parentCategoryID)
    .where('id = :id')
    .bind('id', categoryId)
    .execute()
    .then((res) => {
      return res.getAffectedItemsCount()
    })
    .catch((err) => {
      console.log(err);
      throw "Failed updating category";
    });
}

function deleteCategoryByID(dbSession, categoryId) {
  let table = dbSession.getTable('categories');
  return table.delete().where('id = :id').bind('id', categoryId).execute()
    .then((res) => {
      return res.getAffectedItemsCount();
    })
}

exports.getAllCategories = getAllCategories;
exports.getCategory = getCategory;
exports.addCategory = addCategory;
exports.updateCategoryByID = updateCategoryByID;
exports.deleteCategoryByID = deleteCategoryByID;
exports.Category = Category;
