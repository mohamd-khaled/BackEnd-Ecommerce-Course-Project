const couponModel = require("../Schema/couponSchema");
const handlers = require("./handlers");


// @desc Get Coupons
// @route GET /api/v1/coupons
// @access private/admin-manager
const getCoupons = handlers.getAll(couponModel);

// @desc Get Coupon
// @route GET /api/v1/coupon/:id
// @access private/admin-manager
const getCoupon = handlers.getOne(couponModel);

// @desc Create Coupons
// @route Create /api/v1/coupons
// @access private/admin-manager
const addCoupons = handlers.createOne(couponModel);

// @desc update Specific Coupons
// @route PUT /api/v1/coupons/:id
// @access private/admin-manager
const updateCoupon = handlers.updateOne(couponModel);

// @desc Delete Specific Coupons
// @route Delete /api/v1/coupons/:id
// @access private/admin-manager
const deleteCoupon = handlers.deleteOne(couponModel);

module.exports = {
  getCoupons,
  getCoupon,
  addCoupons,
  updateCoupon,
  deleteCoupon,
};
