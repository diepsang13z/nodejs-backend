'use strict';

const { connectRabbitMQ, consumerQueue } = require('../dbs/init.rabbitmq');

const log = console.log;
console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error(`Error consumerToQueue::`, error);
    }
  },

  consumerToQueueSuccess: async (queueName) => {
    try {
      const { channel, connection } = await connectRabbitMQ();
      const notificationQueue = 'notification_queue_process';
      const timeExpired = 20000;

      setTimeout(() => {
        channel.consume(notificationQueue, (message) => {
          const content = message.content.toString();
          console.log(`Send notification successfully processed:: ${content}`);
          channel.ack(message);
        });
      }, timeExpired);
    } catch (error) {
      console.error(`Error consumerToQueueSuccess::`, error);
    }
  },

  consumerToQueueFailed: async (queueName) => {
    try {
      const { channel, connection } = await connectRabbitMQ();

      const notificationExchangeDLX = 'notification_exchange_DLX';
      const notificationRoutingKeyDLX = 'notification_routing_key_DLX';
      const notificationQueueHandler = 'notification_queue_hot_fix';

      await channel.assertExchange(notificationExchangeDLX, 'direct', {
        durable: true,
      });

      const { queue } = await channel.assertQueue(notificationQueueHandler, {
        exclusive: false,
      });
      await channel.bindQueue(
        queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX,
      );

      await channel.consume(
        queue,
        (message) => {
          const content = message.content.toString();
          console.log(
            `This notification error message!! Pls hot fix!!`,
            content,
          );
        },
        {
          noAck: true,
        },
      );
    } catch (error) {
      console.error(`Error consumerToQueueFailed::`, error);
    }
  },
};

module.exports = messageService;
