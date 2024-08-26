'use strict';

const Product = require('./product');

const { clothing: clothingModel } = require('../../models/product.model');
const { updateProductById } = require('../../models/repositories/product.repo');
const { removeMissingData, updateNestedObjParser } = require('../../utils');

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

  async updateProduct(productId) {
    let params = this;

    // Process missing data
    params = removeMissingData(params);
    params = updateNestedObjParser(params);

    // Update child product
    if (params.product_attributes) {
      await updateProductById({
        productId,
        payload: params,
        model: clothingModel,
      });
    }

    // Update base product
    const updatedProduct = await super.updateProduct(productId, params);
    return updatedProduct;
  }
}

module.exports = Clothing;
