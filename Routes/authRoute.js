const express = require("express");

const router = express.Router();

const {
  signUp,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} = require("../Controllers/authController");

const {
  signUpValidator,
  logInValidator,
} = require("../utils/validators/authValidator");

express().use(express.json());

router.post("/signup", signUpValidator, signUp);
router.post("/login", logInValidator, login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/resetPassword", resetPassword);
// router.get("/", getUsers);
// router.get("/:id", getUserValidator, getUser);

// router.put(
//   "/:id",
//   uploadProfileImage,
//   resizeImage,
//   updateUserValidator,
//   updateUser,
// );
// router.delete("/:id", deleteUserValidator, deleteUser);
// router.put("/changepassword/:id", updatePassword);

module.exports = router;
