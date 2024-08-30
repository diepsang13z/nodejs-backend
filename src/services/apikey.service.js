'use strict';

const crypto = require('node:crypto');

const apiKeyModel = require('../models/apikey.model');

class APIKeyService {
  static createAPIKey = async () => {
    return await apiKeyModel.create({
      key: crypto.randomBytes(64).toString('hex'),
      permissions: '0000',
    });
  };

  static findById = async (key) => {
    return await apiKeyModel.findOne({ key, status: true }).lean();
  };
}

module.exports = APIKeyService;
