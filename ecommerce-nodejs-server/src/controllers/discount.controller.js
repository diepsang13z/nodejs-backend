'use strict';

const { CREATED, OK } = require('../core/success.response');

const { calcPage } = require('../utils');

const DiscountService = require('../services/discount.service');

class DiscountController {
  createDiscountCountCode = async (req, res, next) => {
    const payload = req.body;

    new CREATED({
      message: 'Create new Discount success!',
      metadata: await DiscountService.createDiscountCode({
        ...payload,
      }),
    }).send(res);
  };

  getProductsOfDiscount = async (req, res, next) => {
    const { userId } = req.user;
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const code = req.query.code;

    const { products, count } = await DiscountService.findProductsWithDiscount({
      code,
      shopId: userId,
      limit,
      page,
    });
    const { nextPage, prevPage } = calcPage({ count, page });

    new OK({
      message: 'Get Product list with Discount success!',
      metadata: {
        count: count,
        page: page,
        next: nextPage,
        prev: prevPage,
        data: products,
      },
    }).send(res);
  };

  getDiscountsInShop = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const shopId = req.params.shopId;

    const { discounts, count } = await DiscountService.findDiscountsByShop({
      shopId,
      limit,
      page,
    });
    const { nextPage, prevPage } = calcPage({ count, page });

    new OK({
      message: 'Get Discount by Shop success!',
      metadata: {
        count: count,
        page: page,
        next: nextPage,
        prev: prevPage,
        data: discounts,
      },
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    const { userId } = req.user;
    const payload = req.body;

    new OK({
      message: 'Create new Discount success!',
      metadata: await DiscountService.getDiscountAmount({
        ...payload,
        userId: userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
