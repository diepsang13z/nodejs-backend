'use strict';

const redis = require('redis');
const util = require('util');

const {
  reservationInventory,
} = require('../models/repositories/inventory.repo');

const redisClient = redis.createClient();

if (
  typeof redisClient.pexpire === 'function' &&
  typeof redisClient.setnx === 'function'
) {
  const pexpire = util.promisify(redisClient.pexpire).bind(redisClient);
  const setnxAsync = util.promisify(redisClient.setnx).bind(redisClient);
} else {
  console.error('Redis client methods are not available');
}

const acquired = async (cartId, prodcutId, quantity) => {
  const key = `lock_v2024_${prodcutId}`;

  const retryTimes = 10;
  const expireTime = 3000; // 3 second tam lock

  for (let i = 0; i < retryTimes; i++) {
    const result = await setnxAsync(key, expireTime);
    console.log(`Acquired result::`, result);

    if (!result) {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    }

    const isReversation = await reservationInventory({
      productId,
      cartId,
      quantity,
    });

    if (!isReversation.modifiedCount) {
      return null;
    }

    await pexpire(key, expireTime);
    return key;
  }
};

const relaeseLock = async (keyLock) => {
  const delAsyncKey = promisity(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquired,
  relaeseLock,
};
