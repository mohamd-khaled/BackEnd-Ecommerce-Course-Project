const { check } = require('express-validator');
const validatorMiddleware = require("../../middlewares/validatorMiddleware")

exports.getCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid Category ID Format"),
    validatorMiddleware,
];

exports.createCategoryValidator = [
    check("name").notEmpty().withMessage("Category Name Required")
    .isLength({min:3}).withMessage("Category Name Must Be at Least 3 Characters")
    .isLength({max:32}).withMessage("Category Name Must Be at Maximum 32 Characters"),
    validatorMiddleware
];

exports.updateCategoryValidator = [
        check("id").isMongoId().withMessage("Invalid Category ID Format"),
    validatorMiddleware,
];


exports.deleteCategoryValidator = [
        check("id").isMongoId().withMessage("Invalid Category ID Format"),
    validatorMiddleware,
];