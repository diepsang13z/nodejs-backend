'use strict';

const amqp = require('amqplib');

const runConsumer = async () => {
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
    {
      noAck: true,
    },
  );
};

runConsumer().catch(console.error);
