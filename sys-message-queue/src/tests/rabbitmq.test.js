'use strict';

const { testConnectRabbitMQ } = require('../dbs/init.rabbitmq.js');

describe('RabbitMQ Connection', () => {
  it('Should connect to successful RabbitMQ', async () => {
    const result = await testConnectRabbitMQ();
    expect(result).toBeUndefined();
  });
});
