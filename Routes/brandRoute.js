const express = require("express");

const router = express.Router();

const {
  addBrands,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../Controllers/brandController");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

router.post("/", createBrandValidator, addBrands);
router.get("/", getBrands);
router.get("/:id", getBrandValidator, getBrand);

router.put("/:id", updateBrandValidator, updateBrand);
router.delete("/:id", deleteBrandValidator, deleteBrand);

module.exports = router;
