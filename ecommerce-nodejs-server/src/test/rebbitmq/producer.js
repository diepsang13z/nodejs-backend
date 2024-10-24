'use strict';

const amqp = require('amqplib');
const { Buffer } = require('node:buffer');

const message = 'Hello, RabbitMQ';

const runProducer = async () => {
  const connection = await amqp.connect('amqp://guest:123@localhost');
  const channel = await connection.createChannel();

  const queueName = 'test';

  await channel.assertQueue(queueName, {
    durable: true,
  });

  channel.sendToQueue(queueName, Buffer.from(message));
  console.log(`Message sent::`, message);
};

runProducer().catch(console.error);
