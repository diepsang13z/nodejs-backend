'use strict';

const { OK } = require('../core/success.response');
const { listNotiByUser } = require('../services/notification.service');

class NotificationController {
  getNotiByUser = async (req, res, next) => {
    const userId = req.params.userId;

    new OK({
      message: 'Review checkout!',
      metadata: await listNotiByUser({
        userId,
      }),
    }).send(res);
  };
}

module.exports = new NotificationController();
