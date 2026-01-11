const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const productModel = require("../Schema/productSchema");
const ApiError = require("../utils/apierror");

// @desc Get Products
// @route GET /api/v1/products
// @access public
const getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 5 || 5;
  const skip = (page - 1) * limit;
  const products = await productModel
    .find()
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name" });
  res.status(201).json({ results: products.length, page, data: products });
});

// @desc Create Product
// @route POST /api/v1/products
// @access private
const addProducts = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await productModel.create(req.body);
  res.status(200).json({ data: product });
});

// @desc Get Specific Product
// @route GET /api/v1/products/:id
// @access public
const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel
    .findById(id)
    .populate({ path: "category", select: "name" });
  if (!product) {
    return next(new ApiError(`No Product for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc Update Specific Product
// @route PUT /api/v1/products/:id
// @access Private
const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError(`No Product for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc Delete Specific Product
// @route Delete /api/v1/products/:id
// @access Private
const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`No Product for this ID: ${id}`, 404));
  }
  res.status(204).json({ msg: "Product Deleted" });
});

module.exports = {
  addProducts,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
