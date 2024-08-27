'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../../helpers/handler.helper');
const DiscountController = require('../../controllers/discount.controller');
const { verifyAccessToken } = require('../../auth/verify.auth');

// For Authenticated
router.post(
  '',
  asyncHandler(verifyAccessToken),
  asyncHandler(DiscountController.createDiscountCountCode),
);
router.get(
  '/product',
  asyncHandler(verifyAccessToken),
  asyncHandler(DiscountController.getProductsOfDiscount),
);
router.get(
  '/:shopId',
  asyncHandler(verifyAccessToken),
  asyncHandler(DiscountController.getDiscountsInShop),
);
router.post(
  '/amount',
  asyncHandler(verifyAccessToken),
  asyncHandler(DiscountController.getDiscountAmount),
);

module.exports = router;
