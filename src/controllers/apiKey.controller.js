'use strict';

const { CREATED } = require('../core/success.response');

const APIKeyService = require('../services/apiKey.service');

class APIKeyController {
  createAPIKey = async (req, res, next) => {
    new CREATED({
      message: 'Create API Key success!',
      metadata: await APIKeyService.createAPIKey(),
    }).send(res);
  };
}

module.exports = new APIKeyController();
