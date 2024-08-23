'use strict';

require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const router = require('./routes');
const { checkOverload } = require('./helpers/check.connect');

const {
  notFoundHandler,
  errorHandler,
} = require('./middlewares/errorHandler.middleware');

const app = express();

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

app.use(express.json());
app.use(
  express.urlencoded({
    entended: true,
  }),
);

// init db
require('./dbs/init.mongodb');
// checkOverload();

// init router
app.use('/', router);

// handle error
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
