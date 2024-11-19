'use strict';

const amqp = require('amqplib');

const receiveNotification = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:123@localhost');
    const channel = await connection.createChannel();

    const exchangeName = 'video';

    await channel.assertExchange(exchangeName, 'fanout', {
      durable: false,
    });

    const { queue: queueName } = await channel.assertQueue('');
    console.log(`nameQueue:: ${queueName}`);

    await channel.bindQueue(queueName, exchangeName, '');
    await channel.consume(
      queueName,
      (message) => {
        console.log(`Received message:: ${message.content.toString()}`);
      },
      {
        noAck: true,
      },
    );
  } catch (error) {
    console.error(`Error::`, error);
  }
};

const message = process.argv.slice(2).join(' ') || 'Hello Exchange';
receiveNotification({ message });
