const mysqlx = require('@mysql/xdevapi');

class Product {
  constructor(productID, productName, descriptionHE, descriptionEN, displayNameHE, displayNameEN, imagePath, price, stock) {
    this.productID = productID;
    this.productName = productName;
    this.descriptionHE = descriptionHE;
    this.descriptionEN = descriptionEN;
    this.displayNameHE = displayNameHE;
    this.displayNameEN = displayNameEN;
    this.imagePath = imagePath;
    this.price = price;
    this.stock = stock
  }
};

function getAllProducts(dbSession, count = 10, offset = 0) {
  const table = dbSession.getTable('products');
  return table.select().limit(count, offset).execute()
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
          price: data[7],
          stock: data[8],
          isVisible: data[9]
        };
      });
    });
}

function getProduct(dbSession, productId) {
  const table = dbSession.getTable('products');
  const parentsTable = dbSession.getTable('product_categories');
  const categoriesTable = dbSession.getTable('categories');
  return table.select().where('id = :id').bind('id', productId).execute()
    .then((res) => {
      const data = res.fetchOne();
      if (data === undefined) {
        return;
      }
      return parentsTable.select('parent_category_id').where('product_id = :id').bind('id', productId).execute()
        .then((res) => {
          const parentIDs = res.fetchAll().map((result) => result[0]);
          if (parentIDs.length == 0) {
            return {
              id: data[0],
              name: data[1],
              descriptionHE: data[2],
              descriptionEN: data[3],
              displayNameHE: data[4],
              displayNameEN: data[5],
              imagePath: data[6],
              price: data[7],
              stock: data[8],
              isVisible: data[9],
              parentCategories: []
            }
          }
          let promises = [];
          parentIDs.forEach((item, index, array) => {
            promises.push(categoriesTable.select('name', 'display_name_en', 'display_name_he').where('id = :id').bind('id', item).execute())
          })

          return Promise.all(promises).then(async (results) => {
            const parentCategories = await results.map(res => {
              const parentCategory = res.fetchAll()?.[0];
              return {name: parentCategory[0], displayNameEN: parentCategory[1], displayNameHE: parentCategory[1]}
            }).filter((x) => x !== undefined);
            return {
              id: data[0],
              name: data[1],
              descriptionHE: data[2],
              descriptionEN: data[3],
              displayNameHE: data[4],
              displayNameEN: data[5],
              imagePath: data[6],
              price: data[7],
              stock: data[8],
              isVisible: data[9],
              parentCategories: parentCategories
            };
          }).catch((e) => console.error(e));
        })
    });
}

function addProduct(dbSession, product) {
  let table = dbSession.getTable('products');
  // TODO: Insert parent categories one by one to product_categories
  // TODO: add stock to table
  return table.insert(
    'name', 'description_he', 'description_en', 'display_name_he', 'display_name_en', 'image_path', 'price', 'stock')
    .values(
      product.productName,
      product.descriptionHE,
      product.descriptionEN,
      product.displayNameHE,
      product.displayNameEN,
      product.imagePath,
      product.price,
      product.stock)
    .execute()
    .then((res) => {
      if (res.getAffectedItemsCount() == 0) {
        throw "No items were added"
      }
      return res.getAutoIncrementValue();
    })
}

function updateProductByID(dbSession, productId, newProduct) {
  let table = dbSession.getTable('products');
  return table.update()
    .set('name', newProduct.productName)
    .set('description_he', newProduct.descriptionHE)
    .set('description_en', newProduct.descriptionEN)
    .set('display_name_he', newProduct.displayNameHE)
    .set('display_name_en', newProduct.displayNameEN)
    .set('image_path', newProduct.imagePath)
    .set('price', newProduct.price)
    .set('stock', newProduct.stock)
    .where('id = :id')
    .bind('id', productId)
    .execute()
    .then((res) => {
      return res.getAffectedItemsCount()
    })
    .catch((err) => console.error(err));
}

function deleteProductByID(dbSession, productId) {
  let table = dbSession.getTable('products');
  return table.delete().where('id = :id').bind('id', productId).execute()
    .then((res) => {
      return res.getAffectedItemsCount();
    })
}

exports.getAllProducts = getAllProducts;
exports.getProduct = getProduct;
exports.addProduct = addProduct;
exports.updateProductByID = updateProductByID;
exports.deleteProductByID = deleteProductByID;
exports.Product = Product;
