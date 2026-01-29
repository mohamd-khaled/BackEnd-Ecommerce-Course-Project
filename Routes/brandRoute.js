const express = require("express");

const router = express.Router();

const {
  addBrands,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../Controllers/brandController");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const { protect, allowedTo } = require("../Controllers/authController");

router.post(
  "/",
  protect,
  allowedTo("admin", "manager"),
  uploadBrandImage,
  resizeImage,
  createBrandValidator,
  addBrands,
);
router.get("/", getBrands);
router.get("/:id", getBrandValidator, getBrand);

router.put(
  "/:id",
  protect,
  allowedTo("admin", "manager"),
  uploadBrandImage,
  resizeImage,
  updateBrandValidator,
  updateBrand,
);

router.delete(
  "/:id",
  protect,
  allowedTo("admin", "manager"),
  deleteBrandValidator,
  deleteBrand,
);

module.exports = router;
