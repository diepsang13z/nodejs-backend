'use strict';

const express = require('express');
const router = express.Router();

const { checkAPIKey, checkPermission } = require('../auth/check.auth');

const accessRouter = require('./access');
const productRouter = require('./product');
const discountRouter = require('./discount');

// Check APIKey
router.use(checkAPIKey);
router.use(checkPermission('0000'));

// Router Mapping
router.use('/v1/api', accessRouter);
router.use('/v1/api/product', productRouter);
router.use('/v1/api/discount', discountRouter);

module.exports = router;
