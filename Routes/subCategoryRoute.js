const express = require("express");

const router = express.Router({ mergeparams: true});
const {
  addSubCategories,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../Controllers/subCategoryController");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

router.post("/", createSubCategoryValidator, addSubCategories);
router.get("/", getSubCategories);
router.get("/:id", getSubCategoryValidator, getSubCategory);

router.put("/:id", updateSubCategoryValidator, updateSubCategory);
router.delete("/:id", deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
