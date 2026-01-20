/* eslint-disable node/no-missing-require */
/* eslint-disable import/no-unresolved */
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const asyncHandler = require("express-async-handler");
const brandModel = require("../Schema/brandSchema");
const handlers = require("./handlers");
const uploadImage = require("../middlewares/uploadImageMiddleWare");

// Resize Image
const resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (!req.file) {
    return next();
  }

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);

  // Save image into our DB
  req.body.image = fileName;
  next();
});

//upload Brand Image
const uploadBrandImage = uploadImage.uploadSingleImage("image");

// @desc Get Brands
// @route GET /api/v1/brands
// @access public
const getBrands = handlers.getAll(brandModel);

// @desc Get Specific Brand
// @route GET /api/v1/brands/:id
// @access public
const getBrand = handlers.getOne(brandModel);

// @desc Create Brand
// @route POST /api/v1/brands
// @access private
const addBrands = handlers.createOne(brandModel);

// @desc Update Specific Brand
// @route PUT /api/v1/brands/:id
// @access Private
const updateBrand = handlers.updateOne(brandModel);

// @desc Delete Specific Brand
// @route Delete /api/v1/brands/:id
// @access Private
const deleteBrand = handlers.deleteOne(brandModel);

module.exports = {
  addBrands,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
};
