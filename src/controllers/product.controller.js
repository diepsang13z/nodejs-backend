'use strict';

const { CREATED, OK } = require('../core/success.response');

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

  // Modify
  publishProductForShop = async (req, res, next) => {
    const { userId } = req.user;
    const product_id = req.params.id;

    new OK({
      message: 'Publish Product success!',
      metadata: await ProductService.publishProductForShop({
        product_shop: userId,
        product_id: product_id,
      }),
    }).send(res);
  };

  unPublishProductForShop = async (req, res, next) => {
    const { userId } = req.user;
    const product_id = req.params.id;

    new OK({
      message: 'Publish Product success!',
      metadata: await ProductService.unPublishProductForShop({
        product_shop: userId,
        product_id: product_id,
      }),
    }).send(res);
  };
  // End Modify

  // Query
  getDraftProductInShop = async (req, res, next) => {
    const { userId } = req.user;
    new OK({
      message: 'Get list Product!',
      metadata: await ProductService.findDraftsInShop({
        product_shop: userId,
      }),
    }).send(res);
  };

  getPublishProductInShop = async (req, res, next) => {
    const { userId } = req.user;
    new OK({
      message: 'Get list Product!',
      metadata: await ProductService.findPublishInShop({
        product_shop: userId,
      }),
    }).send(res);
  };

  // End Query
}

module.exports = new ProductController();
