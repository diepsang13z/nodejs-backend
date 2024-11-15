'use strict';

const { connectRabbitMQ, consumerQueue } = require('../dbs/init.rabbitmq');

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error(`Error consumerToQueue::`, error);
    }
  },
};

module.exports = messageService;
