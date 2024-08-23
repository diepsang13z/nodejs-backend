'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../../helpers/handler.helper');
const accessController = require('../../controllers/access.controller');
const { authentication } = require('../../auth/utils.auth');

// URL Mapping
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

// For Authenticated
router.use(asyncHandler(authentication));
router.post('/shop/logout', asyncHandler(accessController.logout));

module.exports = router;
