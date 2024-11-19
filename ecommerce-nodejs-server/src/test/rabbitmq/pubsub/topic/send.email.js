'use strict';

const amqp = require('amqplib');
const { Buffer } = require('node:buffer');

const sendEmail = async () => {
  try {
    const conn = await amqp.connect('amqp://guest:123@localhost');
    const channel = await conn.createChannel();

    const exchangeName = 'send_email';
    await channel.assertExchange(exchangeName, 'topic', {
      durable: false,
    });

    const args = process.argv.slice(2);
    const topic = args[0];
    const message = args[1] || 'Fixed!';

    console.log(`Message:: ${message} ::: Topic:: ${topic}`);

    await channel.publish(exchangeName, topic, Buffer.from(message));

    console.log(`Send OK:: ${message}`);

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error(`Error::`, error);
  }
};

sendEmail();
