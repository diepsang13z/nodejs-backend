'use strict';

const { BadRequestError } = require('../core/error.response');
const { findCartById } = require('../models/repositories/cart.repo');
const { selectProductById } = require('../models/repositories/product.repo');

const DiscountService = require('./discount.service');

class CheckoutService {
  static reviewCheckout = async ({ userId, cartId, order = [] }) => {
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new BadRequestError('Cart has not existed!');
    }

    const checkoutOrder = {
        totalProductPrice: 0,
        freeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      detailOrder = [];

    for (const item of order) {
      const { shopId, discountCodes = [], products } = item;

      // Get price for each product in order
      const orderProducts = await Promise.all(
        products.map(async (product) => {
          const foundProduct = await selectProductById(product.id, [
            'product_name',
            'product_price',
            'product_quantity',
          ]);

          if (foundProduct.product_quantity < product.quantity) {
            throw new BadRequestError('Insufficient product quantity!');
          }

          return {
            id: product.id,
            name: foundProduct.product_name,
            price: foundProduct.product_price,
            quantity: product.quantity,
          };
        }),
      );

      if (orderProducts.length !== products.length) {
        throw new BadRequestError('Order wrong!!');
      }

      // Calc total price of product in order
      const totalPrice = orderProducts.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);
      checkoutOrder.totalProductPrice += totalPrice;

      // Calc discount and price of order affter apply discount
      let priceApplyDiscount = checkoutOrder.totalProductPrice;

      if (discountCodes.length > 0) {
        for (const code of discountCodes) {
          const discountAmount = await DiscountService.getDiscountAmount({
            code,
            userId,
            shopId,
            products: orderProducts,
          });
          const discount = discountAmount.discount;

          if (discount > 0) {
            checkoutOrder.totalDiscount += discount;
            priceApplyDiscount -= discount;
          }
        }
      }

      checkoutOrder.totalCheckout = priceApplyDiscount;
      detailOrder.push({
        shopId,
        discountCodes,
        totalPrice,
        priceApplyDiscount,
        orderProducts,
      });
    }

    return {
      order,
      detailOrder,
      checkoutOrder,
    };
  };
}

module.exports = CheckoutService;
