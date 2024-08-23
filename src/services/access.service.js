'use strict';

const { hash, compare } = require('bcrypt');
const { randomBytes } = require('node:crypto');

const {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} = require('../core/error.response');

const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/utils.auth');
const { getInfoData } = require('../utils');

const { findByEmail } = require('./shop.service');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    const shopHolder = await shopModel.findOne({ email }).lean();

    if (shopHolder) {
      throw new BadRequestError('Shop already registered!');
    }

    const passwordHash = await hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (!newShop) {
      throw new InternalServerError('Failed to create new shop!');
    }

    const privateKey = randomBytes(64).toString('hex');
    const publicKey = randomBytes(64).toString('hex');

    const tokens = await createTokenPair(
      { userId: newShop._id, email },
      publicKey,
      privateKey,
    );
    console.log(`Created Tokens Success::`, tokens);

    const keyStore = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    if (!keyStore) {
      throw new InternalServerError('Failed to store key!');
    }

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: newShop,
      }),
      tokens,
    };
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const shop = await findByEmail({ email });
    if (!shop) {
      throw new BadRequestError('Shop not registered!');
    }

    const match = compare(password, shop.password);
    if (!match) {
      throw new UnauthorizedError('Authentication failed!');
    }

    const privateKey = randomBytes(64).toString('hex');
    const publicKey = randomBytes(64).toString('hex');

    const tokens = await createTokenPair(
      { userId: shop._id, email },
      publicKey,
      privateKey,
    );
    console.log(tokens);
    console.log(tokens.refreshToken);

    const keyStore = await KeyTokenService.createKeyToken({
      userId: shop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    if (!keyStore) {
      throw new InternalServerError('Failed to store key!');
    }

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: shop,
      }),
      tokens,
    };
  };
}

module.exports = AccessService;
