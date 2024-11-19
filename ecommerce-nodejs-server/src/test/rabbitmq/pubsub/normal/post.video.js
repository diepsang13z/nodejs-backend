'use strict';

const amqp = require('amqplib');
const { Buffer } = require('node:buffer');

const postVideo = async ({ message }) => {
  try {
    const connection = await amqp.connect('amqp://guest:123@localhost');
    const channel = await connection.createChannel();

    const exchangeName = 'video';

    await channel.assertExchange(exchangeName, 'fanout', {
      durable: false,
    });

    await channel.publish(exchangeName, '', Buffer.from(message));
    console.log(`Send OK:: ${message}`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error(`Error::`, error);
  }
};

const message = process.argv.slice(2).join(' ') || 'Hello Exchange';
postVideo({ message });
