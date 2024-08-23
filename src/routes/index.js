'use strict';

const express = require('express');
const router = express.Router();

const { apiKey, permission } = require('../auth/checkAuth');

const accessRouter = require('./access');

// check APIKey
router.use(apiKey);
router.use(permission('0000'));

// router mapping
router.use('/v1/api', accessRouter);

module.exports = router;
