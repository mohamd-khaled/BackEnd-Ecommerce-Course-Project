const express = require("express");

const router = express.Router();

const {
  addAddress,
  removeAddress,
  getAddress
} = require("../Controllers/addressController");


const { protect, allowedTo } = require("../Controllers/authController");

express().use(express.json());

router.post(
  "/",
  protect,
  allowedTo("user"),
  addAddress,
);

router.delete(
  "/",
  protect,
  allowedTo("user"),
  removeAddress,
);

router.get(
  "/",
  protect,
  allowedTo("user"),
  getAddress,
);

module.exports = router;
