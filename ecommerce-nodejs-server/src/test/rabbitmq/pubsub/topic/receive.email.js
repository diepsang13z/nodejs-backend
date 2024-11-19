'use strict';

const amqp = require('amqplib');

const receiveEmail = async () => {
  try {
    const conn = await amqp.connect('amqp://guest:123@localhost');
    const channel = await conn.createChannel();

    const exchangeName = 'send_email';
    await channel.assertExchange(exchangeName, 'topic', {
      durable: false,
    });

    const { queue: queueName } = await channel.assertQueue('', {
      exclusive: true,
    });

    const args = process.argv.slice(2);
    if (!args.length) {
      process.exit(0);
    }

    args.forEach(async (key) => {
      await channel.bindQueue(queueName, exchangeName, key);
    });

    console.log(`Waiting queue:: ${queueName} ::: Topic:: ${args}`);

    await channel.consume(queueName, (message) => {
      const routingKey = message.fields.routingKey;
      const content = message.content.toString();
      console.log(`Routing key:: ${routingKey} ::: Message:: ${content}`);
    });
  } catch (error) {
    console.error(`Error::`, error);
  }
};

receiveEmail();
