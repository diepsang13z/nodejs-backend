'use strict';

const { StatusCodes, ReasonPhrases } = require('./http-status-code');

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode;
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    statusCode = StatusCodes.FORBIDDEN,
  ) {
    super(message, statusCode);
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    statusCode = StatusCodes.CONFLICT,
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND,
  ) {
    super(message, statusCode);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED,
  ) {
    super(message, statusCode);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ErrorResponse,
  BadRequestError,
  ConflictRequestError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
};
