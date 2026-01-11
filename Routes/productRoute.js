const express = require("express");

const router = express.Router();

const {
  addProducts,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../Controllers/productController");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

router.post("/", createProductValidator, addProducts);
router.get("/", getProducts);
router.get("/:id", getProductValidator, getProduct);

router.put("/:id", updateProductValidator, updateProduct);
router.delete("/:id", deleteProductValidator, deleteProduct);

module.exports = router;
