'use strict';

const { InternalServerError } = require('../core/error.response');
const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    const filter = {
        user: userId,
      },
      update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      },
      options = { upsert: true, new: true };

    const tokens = await keyTokenModel.findOneAndUpdate(
      filter,
      update,
      options,
    );

    return tokens ? tokens.privateKey : null;
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: userId }).lean();
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static updateRefreshToken = async (keyStoreId, newRefreshToken) => {
    return await keyTokenModel
      .findOneAndUpdate(
        { _id: keyStoreId },
        {
          $set: {
            refreshToken: newRefreshToken,
          },
          $addToSet: {
            refreshTokensUsed: '$refreshToken',
          },
        },
      )
      .lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne(id);
  };

  static removeKeyByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };
}

module.exports = KeyTokenService;
