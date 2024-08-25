'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../../helpers/handler.helper');
const productController = require('../../controllers/product.controller');
const { verifyAccessToken } = require('../../auth/verify.auth');

// For Authenticated
router.use(asyncHandler(verifyAccessToken));
router.post('', asyncHandler(productController.createProduct));

// Query
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop));
// End Query

module.exports = router;
