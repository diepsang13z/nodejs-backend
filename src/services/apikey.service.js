'use strict';

const apiKeyModel = require('../models/apikey.model');

class APIKeyService {
  static findById = async (key) => {
    return await apiKeyModel.findOne({ key, status: true }).lean();
  };
}

module.exports = APIKeyService;
