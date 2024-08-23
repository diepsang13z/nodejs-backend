'use strict';

const { OK, CREATED } = require('../core/success.response');

const AccessService = require('../services/access.service');

class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Registered OK!',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  login = async (req, res, next) => {
    new OK({
      message: 'Login OK!',
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
