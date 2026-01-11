const express = require("express");

//mergeparams to access categoryId from parent route
const router = express.Router({ mergeParams: true });

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
  setCategoryIdToBody,
  createSubCategoryValidator,
  addSubCategories
);
router.get("/", createFilterObject, getSubCategories);
router.get("/:id", getSubCategoryValidator, getSubCategory);

router.put("/:id", updateSubCategoryValidator, updateSubCategory);
router.delete("/:id", deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
