'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandler } = require('../../helpers/handler.helper');
const { verifyAccessToken } = require('../../auth/verify.auth');

const commentController = require('../../controllers/comment.controller');

// For Authenticated
router.post(
  '',
  asyncHandler(verifyAccessToken),
  asyncHandler(commentController.createComment),
);

router.delete(
  '/:commentId',
  asyncHandler(verifyAccessToken),
  asyncHandler(commentController.deleteComment),
);

router.get(
  '/product/:productId',
  asyncHandler(verifyAccessToken),
  asyncHandler(commentController.getCommentByParentId),
);

module.exports = router;
