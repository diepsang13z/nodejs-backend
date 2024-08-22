'use strict';

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const { checkOverload } = require('./helpers/check.connect');

const app = express();

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// init db
require('./dbs/init.mongodb');
checkOverload();

// init router
app.get('/', (req, res, next) => {
  const str = '123';
  return res.status(200).json({
    message: 132,
    metadata: str.repeat(1000),
  });
});

// handle error

module.exports = app;
