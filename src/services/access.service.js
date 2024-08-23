'use strict';

const { hash } = require('bcrypt');
const { randomBytes } = require('node:crypto');

const {
  BadRequestError,
  InternalServerError,
} = require('../core/error.response');

const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');

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

    const keyStore = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
      privateKey,
    });

    if (!keyStore) {
      throw new InternalServerError('Failed to store key!');
    }

    const tokens = await createTokenPair(
      { userId: newShop._id, email },
      publicKey,
      privateKey,
    );
    console.log(`Created Tokens Success::`, tokens);

    return {
      code: '20011',
      metadata: {
        shop: getInfoData({
          fields: ['_id', 'name', 'email'],
          object: newShop,
        }),
        tokens,
      },
    };
  };
}

module.exports = AccessService;
