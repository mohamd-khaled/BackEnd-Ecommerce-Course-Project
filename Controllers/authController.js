const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userModel = require("../Schema/userSchema");
const ApiError = require("../utils/apierror");
const sendEmail = require("../utils/sendEmail");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });

// @desc   Sign Up New User
// @route  POST /api/v1/auth/signup
// @access Public
exports.signUp = asyncHandler(async (req, res, next) => {
  // 1-create user
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2-Generate token
  const token = createToken(user._id);
  // 3-send response
  res.status(201).json({ data: user, token });
});

// @desc   login User
// @route  POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1-check if there are email and password in body (validatorMiddleware)
  // 2-check if user exists && password is correct
  const user = await userModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  // 3-Generate token
  const token = createToken(user._id);
  // 4-send response
  res.status(200).json({ data: user, token });
});

// @desc   Protect Routes to logged in users
exports.protect = asyncHandler(async (req, res, next) => {
  // 1-Get token from headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("You are not logged in! please log in to get access", 401),
    );
  }
  // 2-Verify token (no change done to it or not expired)
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3-Get user from token and check if user still exists
  const currentUser = await userModel.findById(decode.userId);
  if (!currentUser) {
    return next(
      new ApiError("The user belonging to this token no longer exists.", 401),
    );
  }
  // 4-Check if user changed password after token was issued
  if (currentUser.passwordChangedAt) {
    const changedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    if (decode.iat < changedTimestamp) {
      return next(
        new ApiError(
          "User recently changed password! please log in again",
          401,
        ),
      );
    }
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

// @desc   Restrict To specific roles
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1- access registered in req.user from protect middleware to get user role
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403),
      );
    }
    next();
  });

// @desc   Forget Password
// @route  POST /api/v1/auth/forgetPassword
// @access Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1- Get user by email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with this email", 404));
  }

  // 2- if user exists, generate 6 digits code and save it to DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Reset Code: ${resetCode}`);
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  user.save();

  // 3- send code to user email
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 minutes)",
      message: `Your password reset code is: ${resetCode}`,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("Error sending email", 500));
  }

  // 4- send response to user
  res
    .status(200)
    .json({ status: "success", message: "Reset code sent to email!" });
});

// @desc   Verify Reset Code
// @route  POST /api/v1/auth/verifyResetCode
// @access Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  // 1- Get user based on the reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await userModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset code is invalid or has expired", 400));
  }

  // 2- If user is found, verify the reset code
  user.passwordResetVerified = true;
  await user.save();

  res
    .status(200)
    .json({ status: "success", message: "Reset code verified successfully!" });
});

// @desc   Reset Password
// @route  POST /api/v1/auth/resetPassword
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1- Get user based on email
  const user = await userModel.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(new ApiError("There is no user with this email", 404));
  }

  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  // 2- Update password
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  // 3- Send response
  const token = createToken(user._id);
  res
    .status(200)
    .json({ status: "success", message: "Password reset successfully!", token });
});
