'use strict';

const { product: productModel } = require('../product.model');

const queryProduct = async ({ query, limit, skip }) => {
  return await productModel
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
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

module.exports = {
  queryProduct,
  publishProductForShop,
  unPublishProductForShop,
  searchProductByUser,
};