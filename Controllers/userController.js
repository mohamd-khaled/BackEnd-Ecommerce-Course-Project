/* eslint-disable node/no-missing-require */
/* eslint-disable import/no-unresolved */
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("../Schema/userSchema");
const handlers = require("./handlers");
const uploadImage = require("../middlewares/uploadImageMiddleWare");
const ApiError = require("../utils/apierror");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });

// Resize Image
const resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (!req.file) {
    return next();
  }

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${fileName}`);

  // Save image into our DB
  req.body.image = fileName;
  next();
});

//upload Profile Image
const uploadProfileImage = uploadImage.uploadSingleImage("profileImg");

// @desc Get Users
// @route GET /api/v1/users
// @access private
const getUsers = handlers.getAll(userModel);

// @desc Get Specific User
// @route GET /api/v1/users/:id
// @access private
const getUser = handlers.getOne(userModel);

// @desc Create User
// @route POST /api/v1/users
// @access Private/Admin
const addUsers = handlers.createOne(userModel);

// @desc Update Specific User
// @route PUT /api/v1/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.image,
      role: req.body.role,
    },
    {
      new: true,
    },
  );
  if (!document) {
    return next(new ApiError(`No Document for this ID: ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc Update User Password
// @route PUT /api/v1/users/password/:id
// @access Private/Admin
const updatePassword = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );
  if (!document) {
    return next(new ApiError(`No Document for this ID: ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc Delete Specific User
// @route Delete /api/v1/users/:id
// @access Private/Admin
const deleteUser = handlers.deleteOne(userModel);

// @desc Get logged User Data
// @route GET /api/v1/users/getMe
// @access private/user
const getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc updated logged User password
// @route PUT /api/v1/users/changepassword
// @access private/user
const updatedmypassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );

  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

// @desc updated logged User data
// @route PUT /api/v1/users/updateMe
// @access private/user
const updateMe = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.image,
    },
    {
      new: true,
    },
  );

  res.status(200).json({ data: user });
});

// @desc delete logged User
// @route DELETE /api/v1/users/deleteMe
// @access private/user
const deleteMe = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, {
    active: false,
  });

  res.status(204).json({ status: "success" });
});

module.exports = {
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
};
