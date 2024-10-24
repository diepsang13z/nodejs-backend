'use strict';

const { BadRequestError } = require('../core/error.response');

const { API_KEY } = require('./header.auth');

const APIKeyService = require('../services/apiKey.service');

const checkAPIKey = async (req, res, next) => {
  const key = req.headers[API_KEY]?.toString();
  if (!key) {
    next(new BadRequestError('APIKey is required!'));
  }

  // check apiKey
  const objKey = await APIKeyService.findById(key);
  if (!objKey) {
    next(new BadRequestError('Invalid APIKey!'));
  }

  req.objKey = objKey;
  return next();
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      next(new BadRequestError('Permission denied!'));
    }
    console.log(`Permissions::`, req.objKey.permissions);

    const isValidPermissions = req.objKey.permissions.includes(permission);
    if (!isValidPermissions) {
      next(new BadRequestError('Permission denied!'));
    }

    return next();
  };
};

module.exports = {
  checkAPIKey,
  checkPermission,
};
