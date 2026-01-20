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

router.post(
  "/",
  uploadProductImage,
  resizeImage,
  createProductValidator,
  addProducts
);
router.get("/", getProducts);
router.get("/:id", getProductValidator, getProduct);

router.put(
  "/:id",
  uploadProductImage,
  resizeImage,
  updateProductValidator,
  updateProduct
);
router.delete("/:id", deleteProductValidator, deleteProduct);

module.exports = router;
