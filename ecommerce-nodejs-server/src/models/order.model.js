'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'orders';

const orderSchema = new Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    /**
     * order_checkout: {
     *  totalPrice,
     *  totalApllyDiscount,
     *  shipping,
     * }
     */
    order_checkout: {
      type: Object,
      default: {},
    },
    /**
     * order_shipping: {
     *  street,
     *  city,
     *  state,
     *  country,
     * }
     */
    order_shipping: {
      type: Object,
      default: {},
    },
    order_payment: {
      type: Object,
      default: {},
    },
    order_products: {
      type: Array,
      required: true,
    },
    order_trackingNumber: {
      type: String,
      default: '',
    },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

module.exports = model(DOCUMENT_NAME, orderSchema);
