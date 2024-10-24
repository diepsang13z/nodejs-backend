'use strict';

const { StatusCodes, ReasonPhrases } = require('./http-status-code');

class SuccessResponse {
  constructor({ message, statusCode, reasonStatusCode, metadata = {} }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata,
    options,
  }) {
    super({
      message,
      statusCode,
      reasonStatusCode,
      metadata,
    });
    this.options = options;
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata,
    options,
  }) {
    super({
      message,
      statusCode,
      reasonStatusCode,
      metadata,
    });
    this.options = options;
  }
}

class NO_CONTENT extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.NO_CONTENT,
    reasonStatusCode = ReasonPhrases.NO_CONTENT,
    metadata,
    options,
  }) {
    super({
      message,
      statusCode,
      reasonStatusCode,
      metadata,
    });
    this.options = options;
  }
}

module.exports = {
  OK,
  CREATED,
  NO_CONTENT,
};
