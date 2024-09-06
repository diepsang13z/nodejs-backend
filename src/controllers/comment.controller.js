'use strict';

const { CREATED, OK } = require('../core/success.response');

const CommentService = require('../services/comment.service');

class CommentController {
  createComment = async (req, res, next) => {
    const payload = req.body;

    new CREATED({
      message: 'Create new comment!',
      metadata: await CommentService.createComment({
        ...payload,
      }),
    }).send(res);
  };

  getCommentByParentId = async (req, res, next) => {
    const productId = req.params.productId;
    const parentCommentId = req.query.parentId || undefined;

    new OK({
      message: 'Create new comment!',
      metadata: await CommentService.getCommentByParenId({
        productId,
        parentCommentId,
      }),
    }).send(res);
  };
}

module.exports = new CommentController();
