'use strict';

const amqp = require('amqplib');

const consumeOrderedMessage = async () => {
  try {
    const conn = await amqp.connect('amqp://guest:123@localhost');
    const channel = await conn.createChannel();

    const orderedMessageQueue = 'ordered_message_queue';
    await channel.assertQueue(orderedMessageQueue, {
      durable: true,
    });

    channel.prefetch(1); // Mutex to ensure only one ack at a time

    channel.consume(orderedMessageQueue, (message) => {
      const content = message.content.toString();

      setTimeout(() => {
        console.log(`Processed:: ${content}`);
        channel.ack(message);
      }, Math.random() * 1000);
    });
  } catch (error) {
    console.error(`Error::`, error);
  }
};

consumeOrderedMessage().catch((err) => console.error(err));
