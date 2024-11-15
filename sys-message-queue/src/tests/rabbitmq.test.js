'use strict';

const { Buffer } = require('node:buffer');

const { connectRabbitMQ } = require('../dbs/init.rabbitmq');

describe('RabbitMQ Connection', () => {
  const testConnectRabbitMQ = async () => {
    try {
      const { channel, connection } = await connectRabbitMQ();

      const queue = 'Test-Rabbit-Queue';
      const message = 'Hello RabbitMQ';

      await channel.assertQueue(queue);
      await channel.sendToQueue(queue, Buffer.from(message));

      await connection.close();
    } catch (error) {
      console.error('Error connect to RabbitMQ', error);
      throw error;
    }
  };

  it('Should connect to successful RabbitMQ', async () => {
    const result = await testConnectRabbitMQ();
    expect(result).toBeUndefined();
  });
});
