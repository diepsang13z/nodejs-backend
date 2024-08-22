'use strict';

const express = require('express');
const router = express.Router();

const accessRouter = require('./access');
const { apiKey, permission } = require('../auth/checkAuth');

// check apiKey
router.use(apiKey);
router.use(permission('0000'));

// check permission

router.use('/v1/api', accessRouter);

module.exports = router;
