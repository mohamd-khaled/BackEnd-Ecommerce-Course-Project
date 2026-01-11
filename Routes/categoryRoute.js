const express = require("express");
const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

const {
  addCategories,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../Controllers/categorycontroller");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

router.use("/:categoryId/subcategories", subCategoryRoute);

router.post("/", createCategoryValidator, addCategories);
router.get("/", getCategories);
router.get("/:id", getCategoryValidator, getCategory);

router.put("/:id", updateCategoryValidator, updateCategory);
router.delete("/:id", deleteCategoryValidator, deleteCategory);

module.exports = router;
