'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'comments';

const commentSchema = new Schema(
  {
    comment_productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    comment_userId: {
      type: String,
      default: '',
    },
    comment_content: {
      type: String,
      default: '',
    },
    comment_left: {
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    comment_parentId: {
      type: String,
      default: '',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

module.exports = model(DOCUMENT_NAME, commentSchema);
