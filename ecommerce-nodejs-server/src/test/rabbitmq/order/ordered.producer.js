'use strict';

const amqp = require('amqplib');

const produceOrderedMessage = async () => {
  try {
    const conn = await amqp.connect('amqp://guest:123@localhost');
    const channel = await conn.createChannel();

    const orderedMessageQueue = 'ordered_message_queue';
    await channel.assertQueue(orderedMessageQueue, {
      durable: true,
    });

    for (let i = 0; i < 10; i++) {
      const message = `Ordered message:: ${i}`;
      console.log(`Message:: ${message}`);
      channel.sendToQueue(orderedMessageQueue, Buffer.from(message), {
        persistent: true,
      });
    }

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(`Error::`, error);
  }
};

produceOrderedMessage().catch((err) => console.error(err));
