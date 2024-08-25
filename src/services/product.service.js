'use strict';

const { BadRequestError } = require('../core/error.response');

const { Clothing, Electronic, Furniture } = require('./product');
const { findAllDraftsForShop } = require('../models/repositories/product.repo');

// Factory pattern
class ProductFactory {
  static productRegistry = {};

  static registerProductType = (type, classRef) => {
    ProductFactory.productRegistry[type] = classRef;
  };

  static createProduct = async (type, payload) => {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Type:: ${type}`);
    }
    return new productClass(payload).createProduct();
  };

  // Query
  static findAllDraftsForShop = async ({
    product_shop,
    limit = 50,
    skip = 0,
  }) => {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  };
}

// Register product type
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
