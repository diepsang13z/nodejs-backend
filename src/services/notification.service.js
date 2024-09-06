'use strict';

const NotificationModel = require('../models/notification.model');

const pushNotiToSys = async ({
  type = 'SHOP-001',
  senderId,
  receiverId,
  options = {},
}) => {
  let notiContent;

  if (type === 'SHOP-001') {
    notiContent = `@@@ has just added a new product: @@@`;
  } else if (type === 'PROMOTION-001') {
    notiContent = `@@@ has just added a new voucher: @@@`;
  }

  const newNoti = await NotificationModel.create({
    noti_type: type,
    noti_senderId: senderId,
    noti_receiverId: receiverId,
    noti_content: notiContent,
    noti_options: options,
  });

  return newNoti;
};

module.exports = {
  pushNotiToSys,
};
