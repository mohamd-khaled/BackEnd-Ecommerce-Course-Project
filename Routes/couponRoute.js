const express = require("express");

const {
  getCoupons,
  getCoupon,
  addCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../Controllers/couponController");

const { protect, allowedTo } = require("../Controllers/authController");

const router = express.Router();


router.get("/", protect, allowedTo("admin", "manager"), getCoupons);
router.get("/:id", protect, allowedTo("admin", "manager"), getCoupon);
router.post("/", protect, allowedTo("admin", "manager"), addCoupons);
router.put("/:id", protect, allowedTo("admin", "manager"), updateCoupon);
router.delete("/:id", protect, allowedTo("admin", "manager"), deleteCoupon);

module.exports = router;