'use strict';

const { hash } = require('bcrypt');
const { randomBytes, createPublicKey } = require('node:crypto');

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
    try {
      const shopHolder = await shopModel.findOne({ email }).lean();

      if (shopHolder) {
        return {
          code: '2003',
          message: 'shop already registered!',
        };
      }

      const passwordHash = await hash(password, 10);
      const newShope = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShope) {
        // generate publicKey and privateKey
        const privateKey = randomBytes(64).toString('hex');
        const publicKey = randomBytes(64).toString('hex');

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShope._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: '5011',
            message: 'keyStore error!',
          };
        }

        const tokens = await createTokenPair(
          { userId: newShope._id, email },
          publicKey,
          privateKey,
        );
        console.log(`Created Tokens Success::`, tokens);

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ['_id', 'name', 'email'],
              object: newShope,
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      console.log(error);
      return {
        code: '5001',
        message: error.message,
        status: 'error',
      };
    }
  };
}

module.exports = AccessService;
