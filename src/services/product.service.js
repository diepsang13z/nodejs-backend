'use strict';

const { BadRequestError } = require('../core/error.response');

const {
  product: productModel,
  clothing: clothingModel,
  electronic: electronicModel,
} = require('../models/product.model');

// Factory pattern
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case 'Clothing':
        return new Clothing(payload).createProduct();
      case 'Electronic':
        return new Electronic(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid Product Type:: ${type}`);
    }
  }
}

// Base Product
class Product {
  constructor({
    product_name,
    product_thumb,
    product_desc,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_desc = product_desc;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await productModel.create({ ...this, _id: product_id });
  }
}

// Sub-class for different product type
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

module.exports = ProductFactory;