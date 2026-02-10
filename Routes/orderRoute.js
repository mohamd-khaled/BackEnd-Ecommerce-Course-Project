const express = require("express");

const {
  createCashOrder,
  filterOrderForLoggedUser,
  getAllOrders,
  getSpecificOrder,
  updateOrderToPaid,
  updateOrderToDeliver
} = require("../Controllers/orderController");

const { protect, allowedTo } = require("../Controllers/authController");

const router = express.Router();

router.post("/:cartId", protect, allowedTo("user"), createCashOrder);
router.get("/", protect, allowedTo("user", "admin", "manager"), filterOrderForLoggedUser, getAllOrders);
router.get("/:id", protect, allowedTo("user", "admin", "manager"), filterOrderForLoggedUser, getSpecificOrder);
router.put("/:id/pay", protect, allowedTo("admin", "manager"), updateOrderToPaid);
router.put("/:id/deliver", protect, allowedTo("admin", "manager"), updateOrderToDeliver);

module.exports = router;