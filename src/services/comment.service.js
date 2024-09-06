'use strict';

const { NotFoundError } = require('../core/error.response');
const CommentModel = require('../models/comment.model');

/**
 * Using nested set model.
 * See: https://en.wikipedia.org/wiki/Nested_set_model
 */
class CommentService {
  static createComment = async ({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) => {
    const comment = new CommentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;

    if (parentCommentId) {
      const parentComment = await CommentModel.findById(parentCommentId);

      if (!parentComment) {
        throw new NotFoundError('Parent comment not found!');
      }

      rightValue = parentComment.comment_right;

      // Increment 2  left and right value for high level comments
      await CommentModel.updateMany(
        {
          comment_productId: productId,
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        },
      );

      await CommentModel.updateMany(
        {
          comment_productId: productId,
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        },
      );
    } else {
      const maxRightValue = await CommentModel.findOne(
        {
          comment_productId: productId,
        },
        'comment_right',
        {
          sort: { comment_right: -1 },
        },
      );
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  };

  static getCommentByParenId = async ({
    productId,
    parentCommentId,
    limmit = 50,
    page = 1,
  }) => {
    let filter;
    if (parentCommentId) {
      const parentComment = await CommentModel.findById(parentCommentId);

      if (!parentComment) {
        throw new NotFoundError('Parent comment not found!');
      }

      filter = {
        comment_productId: productId,
        comment_left: {
          $gt: parentComment.comment_left,
        },
        comment_right: {
          $lte: parentComment.comment_right,
        },
      };
    } else {
      filter = {
        comment_productId: productId,
      };
    }

    const selectBy = {
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      },
      sortBy = {
        comment_left: 1,
      };

    const comments = await CommentModel.find(filter)
      .select(selectBy)
      .sort(sortBy);

    return comments;
  };

  static deleteComment = async ({ commentId }) => {
    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundError('Comment ID not found!');
    }

    try {
      // Delete child comments
      const productId = comment.comment_productId;
      const leftValue = comment.comment_left;
      const rightValue = comment.comment_right;

      await CommentModel.deleteMany({
        comment_productId: productId,
        comment_left: {
          $gte: leftValue,
          $lte: rightValue,
        },
      });

      // Update remaining comments's width
      const width = rightValue - leftValue + 1;

      await CommentModel.updateMany(
        {
          comment_productId: productId,
          comment_left: {
            $gt: leftValue,
          },
        },
        {
          $inc: {
            comment_left: -width,
          },
        },
      );

      await CommentModel.updateMany(
        {
          comment_productId: productId,
          comment_right: {
            $gt: rightValue,
          },
        },
        {
          $inc: {
            comment_right: -width,
          },
        },
      );

      return true;
    } catch {
      return false;
    }
  };
}

module.exports = CommentService;
