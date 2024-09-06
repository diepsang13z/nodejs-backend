'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../../helpers/handler.helper');
const { verifyAccessToken } = require('../../auth/verify.auth');
const notificationController = require('../../controllers/notification.controller');

router.get(
  '/:userId',
  asyncHandler(verifyAccessToken),
  asyncHandler(notificationController.getNotiByUser),
);

module.exports = router;
