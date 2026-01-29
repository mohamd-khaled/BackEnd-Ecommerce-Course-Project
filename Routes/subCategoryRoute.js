const express = require("express");

//mergeparams to access categoryId from parent route
const router = express.Router({ mergeParams: true });

const { protect, allowedTo } = require("../Controllers/authController");

const {
  addSubCategories,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObject,
} = require("../Controllers/subCategoryController");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

router.post(
  "/",
  protect,
  allowedTo("admin", "manager"),
  setCategoryIdToBody,
  createSubCategoryValidator,
  addSubCategories,
);
router.get("/", createFilterObject, getSubCategories);
router.get("/:id", getSubCategoryValidator, getSubCategory);

router.put(
  "/:id",
  protect,
  allowedTo("admin", "manager"),
  updateSubCategoryValidator,
  updateSubCategory,
);
router.delete(
  "/:id",
  protect,
  allowedTo("admin", "manager"),
  deleteSubCategoryValidator,
  deleteSubCategory,
);

module.exports = router;
