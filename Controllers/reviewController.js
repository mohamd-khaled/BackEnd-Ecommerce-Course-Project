/* eslint-disable node/no-missing-require */
/* eslint-disable import/no-unresolved */
const reviewModel = require("../Schema/reviewSchema");
const handlers = require("./handlers");

// @desc Get Reviews
// @route GET /api/v1/reviews
// @access public
const getReviews = handlers.getAll(reviewModel);

// @desc Get Specific Review
// @route GET /api/v1/reviews/:id
// @access public
const getReview = handlers.getOne(reviewModel);

// @desc Create Review
// @route POST /api/v1/reviews
// @access protected/user
const addReview = handlers.createOne(reviewModel);

// @desc Update Specific Review
// @route PUT /api/v1/reviews/:id
// @access protected/user
const updateReview = handlers.updateOne(reviewModel);

// @desc Delete Specific Review
// @route Delete /api/v1/reviews/:id
// @access Protected/User-Admin-Manager
const deleteReview = handlers.deleteOne(reviewModel);

module.exports = {
  addReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
