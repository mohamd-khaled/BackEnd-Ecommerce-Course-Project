const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const subCategoryModel = require("../Schema/subCategorySchema");
const ApiError = require("../utils/apierror");

// @desc Create SubCategory
// @route POST /api/v1/subcategories
// @access private
const addSubCategories = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(200).json({ data: subCategory });
});

// GET /api/v1/categories/:id/subcategories
// @desc Get SubCategories
// @route GET /api/v1/subcategories
// @access public
const getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 5 || 5;
  const skip = (page - 1) * limit;
  let filterObject = {};
  if(req.params.categoryId) {filterObject = {category: req.params.categoryId};}
  console.log(filterObject)
  const subCategories = await subCategoryModel
    .find(filterObject)
    .skip(skip)
    .limit(limit)
  res
    .status(201)
    .json({ results: subCategories.length, page, data: subCategories });
});

// @desc Get Specific SubCategory
// @route GET /api/v1/subcategories/:id
// @access public
const getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await subCategoryModel
    .findById(id)
  if (!subcategory) {
    return next(new ApiError(`No SubCategory for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: subcategory });
});

// @desc Update Specific Category
// @route PUT /api/v1/categories/:id
// @access Private
const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await subCategoryModel.findOneAndUpdate(
    { _id: id },
    { name: name, slug: slugify(name), category: category },
    { new: true }
  );
  if (!subCategory) {
    return next(new ApiError(`No SubCategory for this ID: ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// @desc Delete Specific Category
// @route Delete /api/v1/categories/:id
// @access Private
const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findOneAndDelete(id);
  if (!subCategory) {
    return next(new ApiError(`No Category for this ID: ${id}`, 404));
  }
  res.status(204).json({ msg: "Category Deleted" });
});

module.exports = {
  addSubCategories,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
