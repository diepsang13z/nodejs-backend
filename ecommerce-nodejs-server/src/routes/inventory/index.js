'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../../helpers/handler.helper');
const InventoryController = require('../../controllers/inventory.controller');
const { verifyAccessToken } = require('../../auth/verify.auth');

// For Authenticated
router.post(
  '',
  asyncHandler(verifyAccessToken),
  asyncHandler(InventoryController.addStockToInventory),
);

module.exports = router;
