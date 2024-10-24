'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../../helpers/handler.helper');
const APIKeyController = require('../../controllers/apiKey.controller');

router.post('', asyncHandler(APIKeyController.createAPIKey));

module.exports = router;
