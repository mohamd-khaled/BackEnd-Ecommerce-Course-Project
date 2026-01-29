const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const userModel = require("../../Schema/userSchema");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User Name Required")
    .isLength({ min: 3 })
    .withMessage("User Name Must Be at Least 3 Characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email Required")
    .isEmail()
    .withMessage("Invalid Email Format")
    .custom((value) =>
      userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email is in use"));
        }
      }),
    ),

  check("password")
    .notEmpty()
    .withMessage("Password Required")
    .isLength({ min: 6 })
    .withMessage("Password Must Be at Least 6 Characters"),

  check("passwordconfirm")
    .notEmpty()
    .withMessage("password confirmation required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password confirmation does not match");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.logInValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Required")
    .isEmail()
    .withMessage("Invalid Email Format"),

  check("password")
    .notEmpty()
    .withMessage("Password Required")
    .isLength({ min: 6 })
    .withMessage("Password Must Be at Least 6 Characters"),

  validatorMiddleware,
];
