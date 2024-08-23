'use strict';

const express = require('express');
const router = express.Router();

const { apiKey, permission } = require('../auth/check.auth');

const accessRouter = require('./access');

// Check APIKey
router.use(apiKey);
router.use(permission('0000'));

// Router Mapping
router.use('/v1/api', accessRouter);

module.exports = router;
