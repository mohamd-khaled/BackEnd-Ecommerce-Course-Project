const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const reviewModel = require("../../Schema/reviewSchema");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review ID Format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Ratings Are Required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings Must Be Between 1 And 5"),
  check("user")
    .notEmpty()
    .withMessage("User ID Is Required")
    .isMongoId()
    .withMessage("Invalid User ID Format"),
  check("product")
    .notEmpty()
    .withMessage("Product ID Is Required")
    .isMongoId()
    .withMessage("Invalid Product ID Format")
    .custom((value, { req }) => {
      // Prevent User From Submitting More Than One Review Per Product
      reviewModel
        .findOne({ user: req.user_id, product: req.body.product })
        .then((review) => {
          if (review) {
            return Promise.reject(
              new Error("You Submitted a Review for This Product"),
            );
          }
        });
      return true;
    }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id", "Invalid Review ID")
    .notEmpty()
    .withMessage("Review ID Is Required")
    .isMongoId()
    .withMessage("Invalid Review ID Format")
    .custom((value, { req }) => reviewModel.findById(value).then((review) => {
        if (!review) {
          return Promise.reject(new Error("Review Not Found"));
        }
        console.log(req.params.id);
        console.log(review);
        console.log(review.user._id.toString(), req.user._id.toString());
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You Are Not Authorized To Update This Review"),
          );
        }
      })),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID Format")
    .custom((value, { req }) => {
      reviewModel.findById(value).then((review) => {
        if (!review) {
          return Promise.reject(new Error("Review Not Found"));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You Are Not Authorized To Update This Review"),
          );
        }
      });
    }),
  validatorMiddleware,
];
