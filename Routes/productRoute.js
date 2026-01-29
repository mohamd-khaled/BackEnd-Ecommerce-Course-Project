const express = require("express");

const router = express.Router();

const {
  addProducts,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeImage,
} = require("../Controllers/productController");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const { protect, allowedTo } = require("../Controllers/authController");

router.post(
  "/",
  protect,
  allowedTo("admin", "manager"),
  uploadProductImage,
  resizeImage,
  createProductValidator,
  addProducts,
);
router.get("/", getProducts);
router.get("/:id", getProductValidator, getProduct);

router.put(
  "/:id",
  protect,
  allowedTo("admin", "manager"),
  uploadProductImage,
  resizeImage,
  updateProductValidator,
  updateProduct,
);
router.delete(
  "/:id",
  protect,
  allowedTo("admin", "manager"),
  deleteProductValidator,
  deleteProduct,
);

module.exports = router;
