'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../../helpers/handler.helper');
const productController = require('../../controllers/product.controller');
const { authentication } = require('../../auth/utils.auth');

// For Authenticated
router.use(asyncHandler(authentication));
router.post('', asyncHandler(productController.createProduct));

module.exports = router;
