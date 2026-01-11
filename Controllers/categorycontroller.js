const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../Schema/categorySchema");
const ApiError = require("../utils/apierror");

// @desc Get Categories
// @route GET /api/v1/categories
// @access public
const getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 5 || 5;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find().skip(skip).limit(limit);
  res.status(201).json({ results: categories.length, page, data: categories });
});

// @desc Create Category
// @route POST /api/v1/categories
// @access private
const addCategories = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(200).json({ data: category });
});

// @desc Get Specific Category
// @route GET /api/v1/categories/:id
// @access public
const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new ApiError(`No Category for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc Update Specific Category
// @route PUT /api/v1/categories/:id
// @access Private
const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await CategoryModel.findByIdAndUpdate(
    id,
    { name: name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError(`No Category for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc Delete Specific Category
// @route Delete /api/v1/categories/:id
// @access Private
const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`No Category for this ID: ${id}`, 404));
  }
  res.status(204).json({ msg: "Category Deleted" });
});

module.exports = {
  addCategories,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
