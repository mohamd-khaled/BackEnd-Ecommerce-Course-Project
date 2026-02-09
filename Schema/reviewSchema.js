const mongoose = require("mongoose");
const productModel = require("./productSchema");

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
    // Parent Referencing
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
  },
  { timestamps: true },
);

reviewSchema.pre(/^find/, async function(){
  this.populate({path:"user", select: "name"})

})


reviewSchema.statics.calcAverageRatingAndQuantity = async function (productId) {

  const result = await this.aggregate([
    // Stage 1 Match Reviews For The Specified Product
    { $match: {product: productId}},
    // Stage 2 Group Reviews To Calculate Average Rating And Quantity
    { $group: {_id: "$product", avgRating: { $avg: "$ratings"}, ratingsQuantity: { $sum: 1}}}
  ])

  if (result.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRating,
      ratingsQuantity: result[0].ratingsQuantity
    })
  }else {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0
    })  
}
}

reviewSchema.post("save", async function () {
  // this points to the current review document
  await this.constructor.calcAverageRatingAndQuantity(this.product);
})

reviewSchema.post("deleteOne", { document: true }, async function () {
  // this points to the current review document
  const Review = this.constructor;
  await Review.calcAverageRatingAndQuantity(this.product);
})

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;