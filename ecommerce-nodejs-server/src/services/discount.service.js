'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');

const discountModel = require('../models/discount.model');
const { findProducts } = require('../models/repositories/product.repo');
const {
  findDiscountsUnSelect,
} = require('../models/repositories/discount.repo');

class DiscountService {
  static createDiscountCode = async ({
    code,
    start_date,
    end_date,
    is_active,
    shopId,
    min_order_value,
    product_ids,
    applies_to,
    name,
    desc,
    type,
    value,
    max_value,
    max_uses,
    uses_count,
    users_used,
    max_uses_per_user,
  }) => {
    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end date!');
    }

    const discount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
      })
      .lean();

    if (discount && discount.discount_is_active) {
      throw new BadRequestError('Discount existed!');
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_desc: desc,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_used_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    });
    return newDiscount;
  };

  static findProductsWithDiscount = async ({ code, shopId, limit, page }) => {
    const discount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
      })
      .lean();

    if (!discount || !discount.discount_is_active) {
      throw new NotFoundError('Discount does not existed!');
    }

    const { discount_applies_to, discount_product_ids } = discount;
    let products, count;

    if (discount_applies_to === 'all') {
      const result = await findProducts({
        select: ['product_name'],
        filter: {
          product_shop: shopId,
          isPublished: true,
        },
        limit,
        page,
        sort: 'ctime',
      });
      products = result.products;
      count = result.count;
    }

    if (discount_applies_to === 'specific') {
      const result = await findProducts({
        select: ['product_name'],
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit,
        page,
        sort: 'ctime',
      });
      products = result.products;
      count = result.count;
    }

    return { products, count };
  };

  static findDiscountsByShop = async ({ shopId, limit = 50, page = 1 }) => {
    const { discounts, count } = await findDiscountsUnSelect({
      limit,
      page,
      sort: 'ctime',
      filter: {
        discount_shopId: shopId,
        discount_is_active: true,
      },
      unSelect: ['__v', 'discount_shopId'],
    });
    return { discounts, count };
  };

  static getDiscountAmount = async ({ code, userId, shopId, products }) => {
    const discount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
      })
      .lean();

    if (!discount) {
      throw new NotFoundError('Discount does not existed!');
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_type,
      discount_start_date,
      discount_end_date,
      discount_max_uses_per_user,
      discount_users_used,
      discount_value,
    } = discount;

    if (!discount_is_active) {
      throw new NotFoundError('Discount expried!');
    }

    if (!discount_max_uses) {
      throw new NotFoundError('Discount are out!');
    }

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundError('Discount are out!');
    }

    let totalOrder = 0;

    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `Discount requires a minium order value:: ${discount_min_order_value}`,
        );
      }
    }

    let isUserUsedDiscount = false;
    if (discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find((user) => {
        return user.userId === userId;
      });

      if (userUsedDiscount) {
        isUserUsedDiscount = true;
      }
    }

    let amount = 0;
    if (!isUserUsedDiscount) {
      amount =
        discount_type === 'fixed_amount'
          ? discount_value
          : totalOrder * (discount_value / 100);
    }

    return { totalOrder, discount: amount, totalPrice: totalOrder - amount };
  };

  static deleteDiscountCode = async ({ shopId, codeId }) => {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: shopId,
    });
    return deleted;
  };

  static cancelDiscountCode = async ({ codeId, shopId, userId }) => {
    const discount = await discountModel
      .findOne({
        discount_code: codeId,
        discount_shopId: shopId,
      })
      .lean();

    if (!discount) {
      throw new NotFoundError('Discount does not existed!');
    }

    const updatedDiscount = await discountModel.findOneAndDelete(
      { _id: discount._id },
      {
        $pull: {
          discount_users_used: userId,
        },
        $inc: {
          discount_max_uses: 1,
          discount_used_count: -1,
        },
      },
    );

    return updatedDiscount;
  };
}

module.exports = DiscountService;
