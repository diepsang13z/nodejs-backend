'use strict';

const amqp = require('amqplib');
const { Buffer } = require('node:buffer');

const log = console.log;
console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

const runProducerDLX = async () => {
  try {
    const conn = await amqp.connect('amqp://guest:123@localhost');
    const channel = await conn.createChannel();

    const notificationExchange = 'notification_exchange';
    const notificationQueue = 'notification_queue_process';
    const notificationExchangeDLX = 'notification_exchange_DLX';
    const notificationRoutingKeyDLX = 'notification_routing_key_DLX';

    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true,
    });

    const { queue } = await channel.assertQueue(notificationQueue, {
      exclusive: false,
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });
    await channel.bindQueue(queue, notificationExchange);

    const message = 'send new a product';
    console.log(`Product message:: ${message}`);

    await channel.sendToQueue(queue, Buffer.from(message), {
      expiration: '10000',
    });

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(`Error::`, error);
  }
};

runProducerDLX()
  .then((rs) => console.log(rs))
  .catch(console.error);
