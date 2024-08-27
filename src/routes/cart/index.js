'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../../helpers/handler.helper');
const { verifyAccessToken } = require('../../auth/verify.auth');
const cartController = require('../../controllers/cart.controller');

// For Authenticated
router.post(
  '',
  asyncHandler(verifyAccessToken),
  asyncHandler(cartController.addProductToCart),
);
router.delete(
  '/:productId',
  asyncHandler(verifyAccessToken),
  asyncHandler(cartController.deleteProductFromCart),
);
router.post(
  '/update',
  asyncHandler(verifyAccessToken),
  asyncHandler(cartController.updateCart),
);
router.get(
  '',
  asyncHandler(verifyAccessToken),
  asyncHandler(cartController.getCart),
);

module.exports = router;
