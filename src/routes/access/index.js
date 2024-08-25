'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../../helpers/handler.helper');
const accessController = require('../../controllers/access.controller');
const {
  verifyAccessToken,
  verifyRefreshToken,
} = require('../../auth/verify.auth');

// URL Mapping
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));
router.post(
  '/shop/handleRefreshToken',
  asyncHandler(verifyRefreshToken),
  asyncHandler(accessController.handleRefreshToken),
);

// For Authenticated
router.use(asyncHandler(verifyAccessToken));
router.post('/shop/logout', asyncHandler(accessController.logout));

module.exports = router;
