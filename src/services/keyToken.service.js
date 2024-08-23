'use strict';

const keyTokenModel = require('../models/keytoken.model');

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
}

module.exports = KeyTokenService;
