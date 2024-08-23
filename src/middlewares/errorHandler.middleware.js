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
  if (!(err instanceof ErrorResponse)) {
    err = new InternalServerError();
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
