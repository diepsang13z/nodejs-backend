'use strict';

const redis = require('redis');

class RedisPubSubService {
  constructor() {
    this.redisPublisher = redis.createClient();
    this.redisSubscriber = redis.createClient();
  }

  publish = async (channel, message) => {
    return new Promise((resolve, reject) => {
      this.redisPublisher
        .publish(channel, message)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  };

  subscribe = async (channel, cb) => {
    this.redisSubscriber.subscribe(channel);
    this.redisSubscriber.on('message', (channel, message) => {
      cb(channel, message);
    });
  };
}

module.exports = new RedisPubSubService();
