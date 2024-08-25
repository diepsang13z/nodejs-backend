'use strict';

const { model, Schema } = require('mongoose');
const slugify = require('slugify');
const product = require('../services/product');

const DOCUMENT_NAME = {
  product: 'Product',
  clothing: 'Clothing',
  electronic: 'Electronic',
  furniture: 'Furniture',
};

const COLLECTION_NAME = {
  product: 'Products',
  clothing: 'Clothings',
  electronic: 'Electronics',
  funiture: 'Furnitures',
};

// Base product schema
const productSchema = new Schema(
  {
    product_name: {
      type: String, // word by word
      require: true,
    },
    product_thumb: {
      type: String,
      require: true,
    },
    product_desc: String,
    product_slug: String, // word-by-word
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
      enum: ['Clothing', 'Electronic', 'Furniture'],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      require: true,
    },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.54323 -> 4.5
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false, // field not selected when find
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false, // field not selected when find
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.product,
  },
);

// Create index for search:
productSchema.index({ product_name: 'text', product_desc: 'text' }); // For full text search MongoDB

// Document middleware: runs before .save() and .create() ...
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// Different product type schema
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

const furnitureSchema = new Schema(
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
    collection: COLLECTION_NAME.funiture,
  },
);

module.exports = {
  product: model(DOCUMENT_NAME.product, productSchema),
  clothing: model(DOCUMENT_NAME.clothing, clothingSchema),
  electronic: model(DOCUMENT_NAME.electronic, electronicSchema),
  furniture: model(DOCUMENT_NAME.furniture, furnitureSchema),
};
