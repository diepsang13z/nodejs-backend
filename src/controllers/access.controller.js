'use strict';

const { OK, CREATED } = require('../core/success.response');

const AccessService = require('../services/access.service');

class AccessController {
  signUp = async (req, res, next) => {
    const { name, email, password } = req.body;
    new CREATED({
      message: 'Registered!',
      metadata: await AccessService.signUp({ name, email, password }),
    }).send(res);
  };

  login = async (req, res, next) => {
    const { email, password } = req.body;
    new OK({
      message: 'Login Success!',
      metadata: await AccessService.login({ email, password }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    const keyStore = req.keyStore;
    new OK({
      message: 'Logout Success!',
      metadata: await AccessService.logout({ keyStore }),
    }).send(res);
  };

  handleRefreshToken = async (req, res, next) => {
    const refreshToken = req.refreshToken;
    const user = req.user;
    const keyStore = req.keyStore;

    new OK({
      message: 'Handle RefreshToken Success!',
      metadata: await AccessService.handleRefreshToken({
        refreshToken,
        user,
        keyStore,
      }),
    }).send(res);
  };
}

module.exports = new AccessController();
