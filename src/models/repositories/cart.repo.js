'use strict';

const cartModel = require('../cart.model');

const createUserCart = async ({ userId, product = {} }) => {
  const filter = {
      cart_userId: userId,
      cart_state: 'active',
    },
    update = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = {
      upsert: true,
      new: true,
    };
  return cartModel.findOneAndUpdate(filter, update, options);
};

const updateUserCartQuantity = async ({ userId, productId, quantity }) => {
  const filter = {
      cart_userId: userId,
      'cart_products.id': productId,
      cart_state: 'active',
    },
    update = {
      $inc: {
        'cart_products.$.quantity': quantity,
      },
    },
    options = {
      upsert: true,
      new: true,
    };
  return cartModel.findOneAndUpdate(filter, update, options);
};

const deleteProductFromCart = async ({ userId, productId }) => {
  const filter = {
      cart_userId: userId,
      'cart_products.id': productId,
      cart_state: 'active',
    },
    update = {
      $pull: {
        cart_products: {
          id: productId,
        },
      },
      $inc: {
        cart_count_product: -1,
      },
    };
  const deletedCart = await cartModel.updateOne(filter, update);
  return deletedCart;
};

const findUserCart = async ({ userId }) => {
  return await cartModel
    .findOne({
      cart_userId: userId,
    })
    .lean();
};

module.exports = {
  createUserCart,
  updateUserCartQuantity,
  deleteProductFromCart,
  findUserCart,
};
