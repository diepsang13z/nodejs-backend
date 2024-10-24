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

const reservationInventory = async ({ cartId, productId, quantity }) => {
  const filter = {
      inven_productId: productId,
      inven_stock: {
        $gte: quantity,
      },
    },
    update = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservation: {
          quantity,
          cartId,
          createAt: new Date(),
        },
      },
    },
    options = {
      upsert: true,
      new: true,
    };
  return await inventoryModel.updateOne(filter, update, options);
};

module.exports = {
  createInventory,
  reservationInventory,
};
