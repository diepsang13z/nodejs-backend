'use strict';

const { BadRequestError } = require('../core/error.response');

const inventoryModel = require('../models/inventory.model');
const { findProductById } = require('../models/repositories/product.repo');

class InventoryService {
  static addStockToInventory = async ({
    stock,
    productId,
    shopId,
    location,
  }) => {
    const product = await findProductById(productId);
    if (!product) {
      throw new BadRequestError('Product has not existed!');
    }

    const filter = {
        inven_shopId: shopId,
        inven_productId: prodcutId,
      },
      update = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      options = {
        upsert: true,
        new: true,
      };

    return await inventoryModel.findOneAndUpdate(filter, update, options);
  };
}

module.exports = InventoryService;
