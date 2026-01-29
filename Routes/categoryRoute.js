const express = require("express");
const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

const {
  addCategories,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../Controllers/categorycontroller");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const { protect, allowedTo } = require("../Controllers/authController");

router.use("/:categoryId/subcategories", subCategoryRoute);

router.post(
  "/",
  protect,
  allowedTo("admin", "manager"),
  uploadCategoryImage,
  resizeImage,
  createCategoryValidator,
  addCategories,
);
router.get("/", getCategories);
router.get("/:id", getCategoryValidator, getCategory);

router.put(
  "/:id",
  protect,
  allowedTo("admin", "manager"),
  uploadCategoryImage,
  resizeImage,
  updateCategoryValidator,
  updateCategory,
);
router.delete(
  "/:id",
  protect,
  allowedTo("admin", "manager"),
  deleteCategoryValidator,
  deleteCategory,
);

module.exports = router;
