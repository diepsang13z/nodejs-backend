'use strict';

const { NotFoundError, BadRequestError } = require('../core/error.response');
const cartModel = require('../models/cart.model');
const {
  createUserCart,
  updateUserCartQuantity,
  deleteProductFromCart,
  findCartByUserId,
} = require('../models/repositories/cart.repo');
const {
  findProductById,
  selectProductById,
} = require('../models/repositories/product.repo');

class CartService {
  static addToCart = async ({ userId, productId, quantity }) => {
    const foundProduct = await selectProductById(productId, [
      'product_name',
      'product_quantity',
      'product_price',
      'product_shop',
    ]);

    if (!foundProduct) {
      throw new NotFoundError('Product dose not existed!');
    }

    if (!foundProduct.product_quantity === 0) {
      throw new BadRequestError('Product is out!');
    }

    let userCart = await cartModel.findOne({ cart_userId: userId });
    if (!userCart) {
      userCart = await createUserCart({ userId, foundProduct });
    }

    const cartProuct = {
      id: productId,
      name: foundProduct.product_name,
      quantity: quantity,
      price: foundProduct.product_price,
      shop: foundProduct.product_shop,
    };

    // Cart has existed but not have product
    if (userCart.cart_count_product === 0) {
      userCart.cart_products = [cartProuct];
      userCart.cart_count_product = 1;
      return await userCart.save();
    }

    const isProductExistedInCart = userCart.cart_products.some((product) => {
      return product.id === productId;
    });

    if (!isProductExistedInCart) {
      userCart.cart_products = [...userCart.cart_products, cartProuct];
      userCart.cart_count_product++;
      return await userCart.save();
    }

    return await updateUserCartQuantity({
      userId,
      productId: productId,
      quantity: quantity,
    });
  };

  static updateCart = async ({ userId, productId, quantity }) => {
    const userCart = await cartModel.findOne({ cart_userId: userId });
    if (!userCart) {
      throw new NotFoundError('Cart not existed!');
    }

    if (userCart.cart_count_product === 0) {
      throw new NotFoundError('Cart is empty!');
    }

    const foundProduct = await findProductById(productId);
    if (!foundProduct) {
      throw new NotFoundError('Product does not existed!');
    }

    const cartProduct = userCart.cart_products.find((product) => {
      return product.id === productId;
    });

    if (!cartProduct) {
      throw new NotFoundError('Product dose not existed in Cart!');
    }

    // Delete product if quantity down to 0
    if (quantity === 0) {
      return await deleteProductFromCart({ userId, productId });
    }

    const oldQuantity = cartProduct.quantity;

    return await updateUserCartQuantity({
      userId,
      productId,
      quantity: quantity - oldQuantity,
    });
  };

  static deleteProductFromCart = async ({ userId, productId }) => {
    return await deleteProductFromCart({ userId, productId });
  };

  static findUserCart = async ({ userId }) => {
    return await findCartByUserId({ userId });
  };
}

module.exports = CartService;
