'use strict';

const _ = require('lodash');

// Custom fields data in response
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

module.exports = {
  getInfoData,
};
