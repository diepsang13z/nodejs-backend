'use strict';

const { CREATED } = require('../core/success.response');

const ProductService = require('../services/product.service');

class ProductController {
  createProduct = async (req, res, next) => {
    const {
      product_name,
      product_desc,
      product_thumb,
      product_price,
      product_quantity,
      product_type,
      product_shop,
      product_attributes,
    } = req.body;

    new CREATED({
      message: 'Create new Product success!',
      metadata: await ProductService.createProduct(product_type, {
        product_name,
        product_desc,
        product_thumb,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
