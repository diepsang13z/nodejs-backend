'use strict';

const { product: productModel } = require('../../models/product.model');
const { updateProductById } = require('../../models/repositories/product.repo');
const { createInventory } = require('../../models/repositories/inventory.repo');
const { pushNotiToSys } = require('../notification.service');

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

  async createProduct(productId) {
    const newProduct = await productModel.create({ ...this, _id: productId });
    if (newProduct) {
      await createInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }

    // Push notification for user when shop add a new product
    pushNotiToSys({
      type: 'SHOP-001',
      senderId: this.product_shop,
      receiverId: '123',
      options: {
        product_type: this.product_type,
        product_name: this.product_name,
        product_shop: this.product_shop,
      },
    })
      .then((rs) => console.log(rs))
      .catch(console.error);

    return newProduct;
  }

  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: productModel });
  }
}

module.exports = Product;
