const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const brandModel = require("../Schema/brandSchema");
const ApiError = require("../utils/apierror");

// @desc Get Brands
// @route GET /api/v1/brands
// @access public
const getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 5 || 5;
  const skip = (page - 1) * limit;
  const brands = await brandModel.find().skip(skip).limit(limit);
  res.status(201).json({ results: brands.length, page, data: brands });
});

// @desc Create Brand
// @route POST /api/v1/brands
// @access private
const addBrands = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await brandModel.create({ name, slug: slugify(name) });
  res.status(200).json({ data: brand });
});

// @desc Get Specific Brand
// @route GET /api/v1/brands/:id
// @access public
const getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findById(id);
  if (!brand) {
    return next(new ApiError(`No Brand for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc Update Specific Brand
// @route PUT /api/v1/brands/:id
// @access Private
const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await brandModel.findByIdAndUpdate(
    id,
    { name: name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    return next(new ApiError(`No Brand for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc Delete Specific Brand
// @route Delete /api/v1/brands/:id
// @access Private
const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`No Brand for this ID: ${id}`, 404));
  }
  res.status(204).json({ msg: "Brand Deleted" });
});

module.exports = { addBrands, getBrands, getBrand, updateBrand, deleteBrand };
