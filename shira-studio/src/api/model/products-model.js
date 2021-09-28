const mysqlx = require('@mysql/xdevapi');

class Product {
  constructor(productID, productName, descriptionHE, descriptionEN, displayNameHE, displayNameEN, imagePath, price) {
    this.productID = productID;
    this.productName = productName;
    this.descriptionHE = descriptionHE;
    this.descriptionEN = descriptionEN;
    this.displayNameHE = displayNameHE;
    this.displayNameEN = displayNameEN;
    this.imagePath = imagePath;
    this.price = price;
  }
};

function getAllProducts(dbSession, count = 10, offset = 0) {
  const table = dbSession.getTable('products');
  return table.select().limit(count, offset).execute()
    .then((res) => {
      return res.fetchAll();
    });
}

function getProduct(dbSession, productId) {
  const table = dbSession.getTable('products');
  return table.select().where('id = :id').bind('id', productId).execute()
    .then((res) => {
      return res.fetchOne();
    });
}

function addProduct(dbSession, product) {
  let table = dbSession.getTable('products');
  // TODO: Insert parent categories one by one to product_categories
  // TODO: add stock to table
  return table.insert(
    'name', 'description_he', 'description_en', 'display_name_he', 'display_name_en', 'image_path', 'price')
    .values(
      product.productName,
      product.descriptionHE,
      product.descriptionEN,
      product.displayNameHE,
      product.displayNameEN,
      product.imagePath,
      product.price)
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
    .where('id = :id')
    .bind('id', productId)
    .execute()
    .then((res) => {
      return res.getAffectedItemsCount()
    })
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
