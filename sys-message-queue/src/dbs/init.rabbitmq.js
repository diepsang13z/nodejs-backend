'use strict';

const amqp = require('amqplib');
const { Buffer } = require('node:buffer');

const connectRabbitMQ = async () => {
  const connection = await amqp.connect('amqp://guest:123@localhost');
  if (!connection) {
    throw new Error('Connect is established!');
  }

  const channel = await connection.createChannel();

  return { channel, connection };
};

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

module.exports = {
  connectRabbitMQ,
  testConnectRabbitMQ,
};
