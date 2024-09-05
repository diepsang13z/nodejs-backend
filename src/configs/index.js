'use strict';

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 8000,
  },
  db: {
    url: process.env.DEV_MONGODB_URL || '',
  },
  redis: {
    url: process.env.DEV_REDIS_URL || 'redis://localhost:6379',
  },
};

const test = {
  app: {
    port: process.env.TEST_APP_PORT || 8000,
  },
  db: {
    url: process.env.TEST_MONGODB_URL || '',
  },
  redis: {
    url: process.env.TEST_REDIS_URL || 'redis://localhost:6379',
  },
};

const prod = {
  app: {
    port: process.env.PROD_APP_PORT || 8000,
  },
  db: {
    url: process.env.PROD_MONGODB_URL || '',
  },
  redis: {
    url: process.env.PROD_REDIS_URL || 'redis://localhost:6379',
  },
};

const config = { dev, test, prod };
const env = process.env.NODE_ENV || 'dev';

module.exports = config[env];
