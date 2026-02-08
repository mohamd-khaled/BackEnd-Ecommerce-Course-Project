const express = require("express");

const router = express.Router();

const {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require("../Controllers/wishlistController");


const { protect, allowedTo } = require("../Controllers/authController");

express().use(express.json());

router.post(
  "/",
  protect,
  allowedTo("user"),
  addToWishlist,
);

router.delete(
  "/",
  protect,
  allowedTo("user"),
  removeFromWishlist,
);

router.get(
  "/",
  protect,
  allowedTo("user"),
  getWishlist,
);

module.exports = router;
