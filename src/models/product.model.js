'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = {
  product: 'Product',
  clothing: 'Clothing',
  electronic: 'Electronic',
};

const COLLECTION_NAME = {
  product: 'Products',
  clothing: 'Clothings',
  electronic: 'Electronics',
};

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      require: true,
    },
    product_thumb: {
      type: String,
      require: true,
    },
    product_desc: String,
    product_price: {
      type: Number,
      require: true,
    },
    product_quantity: {
      type: Number,
      require: true,
    },
    product_type: {
      type: String,
      require: true,
      enum: ['Clothing', 'Electronic'],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.product,
  },
);

const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      require: true,
    },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.clothing,
  },
);

const electronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
      require: true,
    },
    model: String,
    color: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.electronic,
  },
);

module.exports = {
  product: model(DOCUMENT_NAME.product, productSchema),
  clothing: model(DOCUMENT_NAME.clothing, clothingSchema),
  electronic: model(DOCUMENT_NAME.electronic, electronicSchema),
};
