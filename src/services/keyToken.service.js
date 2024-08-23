'use strict';

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

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne(id);
  };
}

module.exports = KeyTokenService;
