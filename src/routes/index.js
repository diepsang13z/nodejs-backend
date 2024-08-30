'use strict';

const express = require('express');
const router = express.Router();

const { checkAPIKey, checkPermission } = require('../auth/check.auth');

const apikeyRouter = require('./apikey');
const accessRouter = require('./access');
const productRouter = require('./product');
const discountRouter = require('./discount');
const cartRouter = require('./cart');
const checkoutRouter = require('./checkout');

router.use('/v1/api/key', apikeyRouter);

// Check APIKey
router.use(checkAPIKey);
router.use(checkPermission('0000'));

// Router Mapping
router.use('/v1/api/checkout', checkoutRouter);
router.use('/v1/api/discount', discountRouter);
router.use('/v1/api/cart', cartRouter);
router.use('/v1/api/product', productRouter);
router.use('/v1/api', accessRouter);

module.exports = router;
