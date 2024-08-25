'use strict';

const { BadRequestError } = require('../core/error.response');

const { Clothing, Electronic, Furniture } = require('./product');

// Factory pattern
class ProductFactory {
  static productRegistry = {};

  static registerProductType = (type, classRef) => {
    ProductFactory.productRegistry[type] = classRef;
  };

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Type:: ${type}`);
    }
    return new productClass(payload).createProduct();
  }
}

// Register product type
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
