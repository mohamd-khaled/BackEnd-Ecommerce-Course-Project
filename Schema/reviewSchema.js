const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
  },
  { timestamps: true },
);

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
