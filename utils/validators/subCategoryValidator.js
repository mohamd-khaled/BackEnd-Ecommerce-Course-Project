const {check} = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware")


exports.createSubCategoryValidator = [
    check("name").notEmpty().withMessage("SubCategory Name Required")
    .isLength({min:2}).withMessage("Category Name Must Be at Least 3 Characters")
    .isLength({max:32}).withMessage("Category Name Must Be at Maximum 32 Characters"),

    check("category").isMongoId().withMessage("Invalid Category ID"),
    validatorMiddleware
]

exports.getSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid SubCategory ID Format"),
    validatorMiddleware,
];

exports.updateSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid SubCategory ID Format"),
    validatorMiddleware,
];


exports.deleteSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid SubCategory ID Format"),
    validatorMiddleware,
];