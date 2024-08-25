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

  // Query

  /**
   * @desc Get all Drafts Product for Shop
   * @param { Number } limit
   * @param { Number } skip
   * @return { JSON }
   */
  getAllDraftForShop = async (req, res, next) => {
    const { userId } = req.user;
    new OK({
      message: 'Get list Product!',
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: userId,
      }),
    }).send(res);
  };

  // End Query
}

module.exports = new ProductController();
