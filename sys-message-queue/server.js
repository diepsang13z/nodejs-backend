'use strict';

const { consumerToQueue } = require('./src/services/consumerQueue.service');

const queueName = 'test';
consumerToQueue(queueName)
  .then(() => {
    console.log(`Message consumer started ${queueName}`);
  })
  .catch((err) => {
    console.error(`Message Error: ${err.message}`);
  });
