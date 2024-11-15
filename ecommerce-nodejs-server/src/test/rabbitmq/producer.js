'use strict';

const amqp = require('amqplib');
const { Buffer } = require('node:buffer');

const message = "I'm diepsang";

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:123@localhost');
    const channel = await connection.createChannel();

    const queueName = 'test';

    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Message sent::`, message);
    setTimeout(() => {
      connection.close();
      process.exit();
    }, 500);
  } catch (error) {
    console.error(`Error::`, error);
  }
};

runProducer()
  .then((rs) => console.log(rs))
  .catch(console.error);
