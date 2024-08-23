'use strict';

const { BadRequestError } = require('../core/error.response');
const { findById } = require('../services/apikey.service');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key) {
    next(new BadRequestError('APIKey is required!'));
  }

  // check apiKey
  const objKey = await findById(key);
  if (!objKey) {
    next(new BadRequestError('Invalid APIKey!'));
  }

  req.objKey = objKey;
  return next();
};

const permission = (permission) => {
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
  apiKey,
  permission,
};
