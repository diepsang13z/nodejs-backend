'use strict';

const { getInfoData, getUnSelectData } = require('../../utils');
const discountModel = require('../discount.model');

const findDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const fields = getInfoData(select);

  const [discounts, count] = await Promise.all([
    discountModel
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(fields)
      .lean(),
    discountModel.countDocuments(filter),
  ]);
  return { discounts, count };
};

const findDiscountsUnSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const fields = getUnSelectData(unSelect);

  const [discounts, count] = await Promise.all([
    discountModel
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(fields)
      .lean(),
    discountModel.countDocuments(filter),
  ]);
  return { discounts, count };
};

module.exports = {
  findDiscountCodesSelect,
  findDiscountsUnSelect,
};
