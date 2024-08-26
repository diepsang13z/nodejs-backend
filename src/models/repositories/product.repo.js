'use strict';

const { product: productModel } = require('../product.model');
const { getSelectData, getUnSelectData } = require('../../utils');

const queryProduct = async ({ query, limit, page }) => {
  const skip = (page - 1) * limit;
  const sortBy = { updateAt: -1 };

  const [products, count] = await Promise.all([
    productModel
      .find(query)
      .populate('product_shop', 'name email -_id')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    productModel.countDocuments(query),
  ]);
  return { products, count };
};

const searchProductByUser = async ({ keySearch }) => {
  // Full text search MongoDB
  const regexSearch = new RegExp(keySearch);
  return await productModel
    .find(
      {
        isPublished: true,
        $text: {
          $search: regexSearch,
        },
      },
      {
        score: {
          $meta: 'textScore',
        },
      },
    )
    .sort({
      score: {
        $meta: 'textScore',
      },
    })
    .lean();
};

const publishProductForShop = async ({ product_shop, product_id }) => {
  const shop = await productModel.findOne({
    product_shop: product_shop,
    _id: product_id,
  });

  if (!shop) {
    return null;
  }

  shop.isDraft = false;
  shop.isPublished = true;

  const { modifiedCount } = await shop.updateOne(shop);
  return modifiedCount;
};

const unPublishProductForShop = async ({ product_shop, product_id }) => {
  const shop = await productModel.findOne({
    product_shop: product_shop,
    _id: product_id,
  });

  if (!shop) {
    return null;
  }

  shop.isDraft = true;
  shop.isPublished = false;

  const { modifiedCount } = await shop.updateOne(shop);
  return modifiedCount;
};

const findProducts = async ({ select, limit, page, sort, filter }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const fields = getSelectData(select);

  const [products, count] = await Promise.all([
    productModel
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(fields)
      .lean(),
    productModel.countDocuments(filter),
  ]);

  return { products, count };
};

const findDetailProduct = async ({ product_id, unSelect }) => {
  const filter = { _id: product_id, isPublished: true };
  const fields = getUnSelectData(unSelect);
  const product = productModel.find(filter).select(fields).lean();
  return product;
};

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  const filter = {
    _id: productId,
  };
  return await model.findOneAndUpdate(filter, payload, { new: isNew });
};

module.exports = {
  queryProduct,
  publishProductForShop,
  unPublishProductForShop,
  searchProductByUser,
  findProducts,
  findDetailProduct,
  updateProductById,
};
