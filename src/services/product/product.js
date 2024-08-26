'use strict';

const { product: productModel } = require('../../models/product.model');

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

module.exports = Product;