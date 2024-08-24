'use strict';

const bcrypt = require('bcrypt');
const crypto = require('node:crypto');

const {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} = require('../core/error.response');

const shopModel = require('../models/shop.model');
const { createTokenPair, verifyJWT } = require('../auth/utils.auth');
const { getInfoData } = require('../utils');

const KeyTokenService = require('./keyToken.service');
const ShopService = require('./shop.service');

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

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (!newShop) {
      throw new InternalServerError('Failed to create new shop!');
    }

    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

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
    const shop = await ShopService.findByEmail({ email });
    if (!shop) {
      throw new BadRequestError('Shop not registered!');
    }

    const match = bcrypt.compare(password, shop.password);
    if (!match) {
      throw new UnauthorizedError('Authentication failed!');
    }

    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

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

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  static handleRefreshToken = async ({ refreshToken }) => {
    const usedToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken,
    );

    if (usedToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        usedToken.privateKey,
      );
      console.log(`Wrong user::`, { userId, email });

      await KeyTokenService.removeKeyByUserId(userId);
      throw new BadRequestError('Something wrong happend, Pls relogin!');
    }

    const keyStore = await KeyTokenService.getByRefreshToken(refreshToken);
    if (!keyStore) {
      throw new UnauthorizedError('Shop not registered!');
    }

    const { userId, email } = await verifyJWT(
      refreshToken,
      keyStore.privateKey,
    );

    const shop = await ShopService.findByEmail({ email });
    if (!shop) {
      throw new UnauthorizedError('Shop not registered!');
    }
    console.log(`Valid user::`, { userId, email });

    const newTokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey,
    );

    await keyStore.updateOne({
      $set: {
        refreshToken: newTokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      newTokens,
    };
  };
}

module.exports = AccessService;
