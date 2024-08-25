'use strict';

const JWT = require('jsonwebtoken');

const {
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} = require('../core/error.response');

const { CLIENT_ID, AUTHORIZATION, REFRESHTOKEN } = require('./header.auth');

const KeyTokenService = require('../services/keyToken.service');

const verifyAccessToken = async (req, res, next) => {
  const userId = req.headers[CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedError('Invalid Request!');
  }

  const accessToken = req.headers[AUTHORIZATION];
  if (!accessToken) {
    throw new UnauthorizedError('Invalid Request!');
  }

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError('Not found!');
  }

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new UnauthorizedError('Invalid Request!');
    }

    req.keyStore = keyStore;
    req.user = decodeUser;

    return next();
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const verifyRefreshToken = async (req, res, next) => {
  const userId = req.headers[CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedError('Invalid Request!');
  }

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError('Not found!');
  }

  const refreshToken = req.headers[REFRESHTOKEN];
  if (refreshToken) {
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) {
        throw new UnauthorizedError('Invalid Request!');
      }

      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;

      return next();
    } catch (error) {
      throw new InternalServerError(error.message);
    }
  }
};

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
};
