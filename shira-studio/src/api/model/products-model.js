const blob = require('./blob');
const mysqlx = require('@mysql/xdevapi');

class Product {
  constructor(productID, productName, descriptionHE, descriptionEN, displayNameHE, displayNameEN, productImage) {
    this.productID = productID;
    this.productName = productName;
    this.descriptionHE = descriptionHE;
    this.descriptionEN = descriptionEN;
    this.displayNameHE = displayNameHE;
    this.displayNameEN = displayNameEN;
    this.productImage = productImage; // blob.ImageData
  }
};

function getAllProducts(session, count, offset) {
  const table = session.getSchema('shira-studio').getTable('products');
  return table.select().limit(count, offset).execute()
    .then((res) => {
      return res.fetchAll();
    });

}

function getProduct(session, productId) {

}

function addProduct(session, product) {

}

function updateProductByID(session, productId, newProduct) {

}

function removeProductByID(session, productId) {

}

exports.getAllProducts = getAllProducts;
exports.getProduct = getProduct;
exports.addProduct = addProduct;
exports.updateProductByID = updateProductByID;
exports.removeProductByID = removeProductByID;
exports.Product = Product;
