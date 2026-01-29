const express = require("express");

const router = express.Router();

const {
  addUsers,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadProfileImage,
  resizeImage,
  updatePassword,
  getMe,
  updatedmypassword,
  updateMe,
  deleteMe,
} = require("../Controllers/userController");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const { protect, allowedTo } = require("../Controllers/authController");

express().use(express.json());

router.get("/getme", protect, getMe, getUser);

router.put("/changemypassword", protect, allowedTo("user"), updatedmypassword);

router.put(
  "/updatemydata",
  protect,
  allowedTo("user"),
  updateLoggedUserValidator,
  uploadProfileImage,
  resizeImage,
  updateMe,
);

router.delete("/deleteme", protect, allowedTo("user"), deleteMe);

// Admin Routes
router.post(
  "/",
  protect,
  allowedTo("admin"),
  uploadProfileImage,
  resizeImage,
  createUserValidator,
  addUsers,
);
router.get("/", getUsers);
router.get("/:id", getUserValidator, getUser);

router.put(
  "/:id",
  protect,
  allowedTo("admin"),
  uploadProfileImage,
  resizeImage,
  updateUserValidator,
  updateUser,
);

router.delete(
  "/:id",
  protect,
  allowedTo("admin"),
  deleteUserValidator,
  deleteUser,
);

router.put("/changepassword/:id", protect, allowedTo("admin"), updatePassword);

module.exports = router;
