'use strict';

const inventoryModel = require('../inventory.model');

const createInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unKnow',
}) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_location: location,
    inven_stock: stock,
  });
};

module.exports = {
  createInventory,
};
