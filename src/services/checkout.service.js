'use strict';

const { BadRequestError } = require('../core/error.response');

const orderModel = require('../models/order.model');
const { findCartById } = require('../models/repositories/cart.repo');
const { selectProductById } = require('../models/repositories/product.repo');

const DiscountService = require('./discount.service');
const { acquired, relaeseLock } = require('./redis.service');

class CheckoutService {
  static reviewCheckout = async ({ userId, cartId, order = [] }) => {
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new BadRequestError('Cart has not existed!');
    }

    const checkoutOrder = {
        totalProductPrice: 0,
        shipping: 0,
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

  static orderByUser = async ({
    cartId,
    order = [],
    userId,
    userAddress = {},
    userPayment = {},
  }) => {
    const { detailOrder, checkoutOrder } = await CheckoutService.reviewCheckout(
      { userId, cartId, order },
    );

    const products = detailOrder.flatMap((order) => {
      return order.product;
    });
    console.log(`[FlatMap Order]::`, products);

    const acquiredProduct = [];

    for (const item of products) {
      const { id: prodcutId, quantity } = item;

      const keyLock = await acquired({ cartId, prodcutId, quantity });
      acquiredProduct.push(keyLock ? true : false);

      if (keyLock) {
        relaeseLock(keyLock);
      }
    }

    if (acquiredProduct.include(false)) {
      throw new BadRequestError(
        'Some products have been updated. Pls return to cart!',
      );
    }

    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkoutOrder,
      order_shipping: userAddress,
      order_payment: userPayment,
      order_products: products,
    });

    if (newOrder) {
    }

    return {
      userId,
      userAddress,
      userPayment,
      newOrder,
    };
  };

  static findOrderByUser = async () => {};
  static cancelOrderByUser = async () => {};

  static updateOrderStatusByShop = async () => {};
  static updateOrderStatusByUser = async () => {};
}

module.exports = CheckoutService;
