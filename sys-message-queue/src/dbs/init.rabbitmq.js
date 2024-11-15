'use strict';

const amqp = require('amqplib');

const connectRabbitMQ = async () => {
  const connection = await amqp.connect('amqp://guest:123@localhost');
  if (!connection) {
    throw new Error('Connect is established!');
  }

  const channel = await connection.createChannel();

  return { channel, connection };
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages...`);
    channel.consume(
      queueName,
      (message) => {
        console.log(
          `Receive message ${queueName}::`,
          message.content.toString(),
        );
      },
      {
        noAck: true,
      },
    );
  } catch (error) {
    console.error(`Error publish message to rabbitMQ::`, error);
    throw error;
  }
};

module.exports = {
  connectRabbitMQ,
  consumerQueue,
};
