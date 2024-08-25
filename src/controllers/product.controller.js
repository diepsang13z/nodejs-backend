'use strict';

const { CREATED } = require('../core/success.response');

const ProductService = require('../services/product.service');

class ProductController {
  createProduct = async (req, res, next) => {
    const { userId } = req.user;
    const type = req.body.product_type;
    const payload = {
      ...req.body,
      product_shop: userId,
    };

    new CREATED({
      message: 'Create new Product success!',
      metadata: await ProductService.createProduct(type, payload),
    }).send(res);
  };
}

module.exports = new ProductController();
