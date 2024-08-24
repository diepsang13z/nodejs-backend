'use strict';

const JWT = require('jsonwebtoken');

const {
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} = require('../core/error.response');

const { CLIENT_ID, AUTHORIZATION } = require('./header.auth');

const { findByUserId } = require('../services/keyToken.service');

const createTokenPair = async (payload, publicKey, privateKey) => {
  const accessToken = await JWT.sign(payload, publicKey, {
    expiresIn: '2 days',
  });

  const refreshToken = await JWT.sign(payload, privateKey, {
    expiresIn: '7 days',
  });

  JWT.verify(accessToken, publicKey, (err, decode) => {
    if (err) {
      console.log(`error verify::`, err);
    } else {
      console.log(`decode verify::`, decode);
    }
  });

  return { accessToken, refreshToken };
};

const authentication = async (req, res, next) => {
  const userId = req.headers[CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedError('Invalid Request!');
  }

  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError('Not found!');
  }

  const accessToken = req.headers[AUTHORIZATION];
  if (!accessToken) {
    throw new UnauthorizedError('Invalid Request!');
  }

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new UnauthorizedError('Invalid Request!');
    }

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
