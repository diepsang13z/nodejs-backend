'use strict';

const Product = require('./product');

const { clothing: clothingModel } = require('../../models/product.model');

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError('Create new Clothing Error!');
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError('Create new Product Error!');
    }

    return newProduct;
  }
}

module.exports = Clothing;
