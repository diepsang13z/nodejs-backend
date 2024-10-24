'use strict';

const { OK } = require('../core/success.response');

const CartService = require('../services/cart.service');

class CartController {
  addProductToCart = async (req, res, next) => {
    const { userId } = req.user;
    const { productId, quantity } = req.body;

    new OK({
      message: 'Add to Cart success!',
      metadata: await CartService.addToCart({
        userId,
        productId,
        quantity,
      }),
    }).send(res);
  };

  updateCart = async (req, res, next) => {
    const { userId } = req.user;
    const { productId, quantity } = req.body;

    new OK({
      message: 'Update Cart success!',
      metadata: await CartService.updateCart({
        userId,
        productId,
        quantity,
      }),
    }).send(res);
  };

  deleteProductFromCart = async (req, res, next) => {
    const { userId } = req.user;
    const productId = req.params.productId;

    new OK({
      message: 'Delete Cart success!',
      metadata: await CartService.deleteProductFromCart({
        userId,
        productId,
      }),
    }).send(res);
  };

  getCart = async (req, res, next) => {
    const { userId } = req.user;

    new OK({
      message: 'Get Cart success!',
      metadata: await CartService.findUserCart({
        userId,
      }),
    }).send(res);
  };
}

module.exports = new CartController();
