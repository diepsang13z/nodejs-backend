'use strict';

const Product = require('./product');

const { electronic: electronicModel } = require('../../models/product.model');

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequestError('Create new Electronic Error!');
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError('Create new Product Error!');
    }

    return newProduct;
  }
}

module.exports = Electronic;
