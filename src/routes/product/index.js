'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../../helpers/handler.helper');
const productController = require('../../controllers/product.controller');
const { verifyAccessToken } = require('../../auth/verify.auth');

// Query
router.get(
  '/drafts',
  asyncHandler(verifyAccessToken),
  asyncHandler(productController.getDraftProductInShop),
);
router.get(
  '/published',
  asyncHandler(verifyAccessToken),
  asyncHandler(productController.getPublishProductInShop),
);
// End Query

router.get(
  '/search/:keySearch',
  asyncHandler(productController.getListSearchProduct),
);
router.get('/', asyncHandler(productController.getProducts));
router.get('/:id', asyncHandler(productController.getDetailProduct));

// For Authenticated
router.post(
  '',
  asyncHandler(verifyAccessToken),
  asyncHandler(productController.createProduct),
);
router.patch(
  '/:id',
  asyncHandler(verifyAccessToken),
  asyncHandler(productController.updateProduct),
);

// Modify
router.put(
  '/publish/:id',
  asyncHandler(verifyAccessToken),
  asyncHandler(productController.publishProductForShop),
);
router.put(
  '/unpublish/:id',
  asyncHandler(verifyAccessToken),
  asyncHandler(productController.unPublishProductForShop),
);
// End Modify

module.exports = router;
