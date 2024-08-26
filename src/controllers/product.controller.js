'use strict';

const { CREATED, OK } = require('../core/success.response');

const { calcPage } = require('../utils');

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
    const page = parseInt(req.query?.page);

    const { products, totalProducts } = await ProductService.findDraftsInShop({
      product_shop: userId,
      page,
    });
    const { nextPage, prevPage } = calcPage({
      totalItem: totalProducts,
      page,
    });

    new OK({
      message: 'Get list draft product success!',
      metadata: {
        page: page,
        next: nextPage,
        prev: prevPage,
        data: products,
      },
    }).send(res);
  };

  getPublishProductInShop = async (req, res, next) => {
    const { userId } = req.user;
    const page = parseInt(req.query?.page);

    const { products, totalProducts } = await ProductService.findPublishInShop({
      product_shop: userId,
      page,
    });
    const { nextPage, prevPage } = calcPage({
      totalItem: totalProducts,
      page,
    });

    new OK({
      message: 'Get list publised product success!',
      metadata: {
        page: page,
        next: nextPage,
        prev: prevPage,
        data: products,
      },
    }).send(res);
  };

  // End Query

  getListSearchProduct = async (req, res, next) => {
    const keySearch = req.params.keySearch;

    new OK({
      message: 'Get list Product!',
      metadata: await ProductService.searchProduct({ keySearch }),
    }).send(res);
  };
}

module.exports = new ProductController();
