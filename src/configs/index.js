'use strict';

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 8000,
  },
  db: {
    url: process.env.DEV_MONGODB_URL || '',
  },
};

const test = {
  app: {
    port: process.env.TEST_APP_PORT || 8000,
  },
  db: {
    url: process.env.TEST_MONGODB_URL || '',
  },
};

const prod = {
  app: {
    port: process.env.PROD_APP_PORT || 8000,
  },
  db: {
    url: process.env.PROD_MONGODB_URL || '',
  },
};

const config = { dev, test, prod };
const env = process.env.NODE_ENV || 'dev';

module.exports = config[env];
