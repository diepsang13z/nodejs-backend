'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../../helpers/handler.helper');
const productController = require('../../controllers/product.controller');
const { verifyAccessToken } = require('../../auth/verify.auth');

router.get(
  '/search/:keySearch',
  asyncHandler(productController.getListSearchProduct),
);

// For Authenticated
router.use(asyncHandler(verifyAccessToken));
router.post('', asyncHandler(productController.createProduct));

router.put(
  '/publish/:id',
  asyncHandler(productController.publishProductForShop),
);
router.put(
  '/unpublish/:id',
  asyncHandler(productController.unPublishProductForShop),
);

// Query
router.get('/drafts', asyncHandler(productController.getDraftProductInShop));
router.get(
  '/published',
  asyncHandler(productController.getPublishProductInShop),
);
// End Query

module.exports = router;
