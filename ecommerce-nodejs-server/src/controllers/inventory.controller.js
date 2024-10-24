'use strict';

const { OK } = require('../core/success.response');

const InventoryService = require('../services/inventory.service');

class InventoryController {
  addStockToInventory = async (req, res, next) => {
    const payload = req.body;

    new OK({
      message: 'Add stock to inventory success!',
      metadata: await InventoryService.addStockToInventory({
        ...payload,
      }),
    }).send(res);
  };
}

module.exports = new InventoryController();
