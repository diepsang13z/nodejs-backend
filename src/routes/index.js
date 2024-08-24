'use strict';

const express = require('express');
const router = express.Router();

const { checkAPIKey, checkPermission } = require('../auth/check.auth');

const accessRouter = require('./access');

// Check APIKey
router.use(checkAPIKey);
router.use(checkPermission('0000'));

// Router Mapping
router.use('/v1/api', accessRouter);

module.exports = router;
