'use strict';

const Product = require('./product');

const { furniture: furnitureModel } = require('../../models/product.model');

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) {
      throw new BadRequestError('Create new Furniture Error!');
    }

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError('Create new Product Error!');
    }

    return newProduct;
  }
}

module.exports = Furniture;
