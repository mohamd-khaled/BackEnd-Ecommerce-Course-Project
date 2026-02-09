const express = require("express"); 

const { protect, allowedTo } = require("../Controllers/authController");
const { addToCart, getUserCart, deleteItemFromCart, clearCart, updateItemInCart, applyCoupon} = require("../Controllers/cartController");

const router = express.Router();

router.post("/", protect, allowedTo("user"), addToCart);
router.get("/", protect, allowedTo("user"), getUserCart);
router.put("/applycoupon", protect, allowedTo("user"), applyCoupon);
router.put("/:id", protect, allowedTo("user"), updateItemInCart);
router.delete("/", protect, allowedTo("user"), clearCart);
router.delete("/:id", protect, allowedTo("user"), deleteItemFromCart);
module.exports = router;