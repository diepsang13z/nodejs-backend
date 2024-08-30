'use strict';

const { OK } = require('../core/success.response');

const CheckoutService = require('../services/checkout.service');

class CheckoutController {
  reviewCheckout = async (req, res, next) => {
    const { userId } = req.user;
    const payload = req.body;

    new OK({
      message: 'Review checkout!',
      metadata: await CheckoutService.reviewCheckout({
        ...payload,
        userId,
      }),
    }).send(res);
  };
}

module.exports = new CheckoutController();
