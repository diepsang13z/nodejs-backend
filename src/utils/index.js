'use strict';

const _ = require('lodash');

// Custom fields data in response
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

// Cacl total page
const calcPage = ({ totalItem, currPage = 1, limit = 50 }) => {
  const totalPage = Math.ceil(totalItem / limit);
  const nextPage = currPage < totalPage ? page + 1 : null;
  const prevPage = currPage > 1 ? page - 1 : null;
  return { nextPage, prevPage };
};

module.exports = {
  getInfoData,
  calcPage,
};
