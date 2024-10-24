'use strict';

const _ = require('lodash');

// Custom fields data in response
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

// Cacl total page
const calcPage = ({ count, page = 1, limit = 50 }) => {
  const totalPage = Math.ceil(count / limit);
  const nextPage = page < totalPage ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;
  return { nextPage, prevPage };
};

// ['a', 'b'] -> {a: 1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((elem) => [elem, 1]));
};

// ['a', 'b'] -> {a: 0, b: 0}
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((elem) => [elem, 0]));
};

// Process missing data
const removeMissingData = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) {
      delete obj[key];
    }
  });
  return obj;
};

/**
 * obj = {
 *  a: 1,
 *  b: {
 *    c: 1,
 *    d: 2,
 *  }
 * }
 * ->
 * obj = {
 *  a: 1,
 *  b.c: 1,
 *  b.d: 1,
 * }
 */
const updateNestedObjParser = (obj) => {
  const result = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const res = updateNestedObjParser(obj[key]);
      Object.keys(res).forEach((child) => {
        result[`${key}.${child}`] = res[child];
      });
    } else {
      result[key] = obj[key];
    }
  });
  return result;
};

module.exports = {
  getInfoData,
  calcPage,
  getSelectData,
  getUnSelectData,
  removeMissingData,
  updateNestedObjParser,
};
