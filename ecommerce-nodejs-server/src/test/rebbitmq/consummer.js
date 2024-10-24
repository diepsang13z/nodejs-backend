'use strict';

const amqp = require('amqplib');
const { Buffer } = require('node:buffer');

const message = 'Hello, RabbitMQ';

const runConsummer = async () => {
  const connection = await amqp.connect('amqp://guest:123@localhost');
  const channel = await connection.createChannel();

  const queueName = 'test';

  await channel.assertQueue(queueName, {
    durable: true,
  });

  channel.consume(
    queueName,
    (message) => {
      console.log(`Received::`, message.content.toString());
    },
    { noAck: true },
  );
};

runConsummer().catch(console.error);
