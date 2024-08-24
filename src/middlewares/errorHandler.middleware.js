'use strict';

const {
  ErrorResponse,
  NotFoundError,
  InternalServerError,
} = require('../core/error.response');

const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError();
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const DEBUG = 1;
  if (DEBUG === 1) {
    console.log(err);
  }

  if (!(err instanceof ErrorResponse)) {
    err = new InternalServerError(err.message);
  }

  const statusCode = err.status;
  const errorMessage = err.message;

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: errorMessage,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
