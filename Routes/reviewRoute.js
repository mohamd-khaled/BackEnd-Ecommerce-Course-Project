const express = require("express");

const router = express.Router({mergeparams: true});

const {
  addReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  createFilterObject,
  setproductIdToBody
} = require("../Controllers/reviewController");

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const { protect, allowedTo } = require("../Controllers/authController");

router.post("/", protect, allowedTo("user"), setproductIdToBody, createReviewValidator, addReview);
router.get("/", createFilterObject, getReviews);
router.get("/:id", getReviewValidator, getReview);

router.put(
  "/:id",
  protect,
  allowedTo("user"),
  updateReviewValidator,
  updateReview,
);

router.delete(
  "/:id",
  protect,
  allowedTo("user", "admin", "manager"),
  deleteReviewValidator,
  deleteReview,
);

module.exports = router;
