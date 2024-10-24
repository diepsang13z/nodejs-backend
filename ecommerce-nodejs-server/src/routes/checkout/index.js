'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../../helpers/handler.helper');
const CheckoutController = require('../../controllers/checkout.controller');
const { verifyAccessToken } = require('../../auth/verify.auth');

// For Authenticated
router.post(
  '/review',
  asyncHandler(verifyAccessToken),
  asyncHandler(CheckoutController.reviewCheckout),
);

router.post(
  '/',
  asyncHandler(verifyAccessToken),
  asyncHandler(CheckoutController.order),
);

module.exports = router;
