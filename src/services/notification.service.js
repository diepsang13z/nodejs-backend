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

const listNotiByUser = async ({ userId, type = 'ALL', isRead = 0 }) => {
  const match = {
    noti_receiverId: userId,
  };

  if (type != 'ALL') {
    match['noti_type'] = type;
  }

  return await NotificationModel.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receiverId: 1,
        noti_content: {
          $concat: [
            {
              $substr: ['$noti_options.product_shop', 0, -1],
            },
            ' Has just added a new product',
            {
              $substr: ['$noti_options.product_name', 0, -1],
            },
          ],
        },
        noti_options: 1,
        createAt: 1,
      },
    },
  ]);
};

module.exports = {
  pushNotiToSys,
  listNotiByUser,
};
