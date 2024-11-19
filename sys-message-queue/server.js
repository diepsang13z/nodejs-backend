'use strict';

const {
  consumerToQueueSuccess,
  consumerToQueueFailed,
} = require('./src/services/consumerQueue.service');

const QUEUE_NAME = 'test';

consumerToQueueSuccess(QUEUE_NAME)
  .then(() => {
    console.log(`Message consumerToQueueSuccess started ${QUEUE_NAME}`);
  })
  .catch((err) => {
    console.error(`Message Error: ${err.message}`);
  });

consumerToQueueFailed(QUEUE_NAME)
  .then(() => {
    console.log(`Message consumerToQueueFailed started ${QUEUE_NAME}`);
  })
  .catch((err) => {
    console.error(`Message Error: ${err.message}`);
  });
