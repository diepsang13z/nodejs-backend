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

// Init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Init DBs
require('./dbs/init.mongodb');
// checkOverload();

// Init router
app.use('/', router);

// Handle Error
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
