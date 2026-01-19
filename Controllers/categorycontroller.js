const CategoryModel = require("../Schema/categorySchema");
const handlers = require("./handlers");

// @desc Get Categories
// @route GET /api/v1/categories
// @access public
const getCategories = handlers.getAll(CategoryModel);

// @desc Get Specific Category
// @route GET /api/v1/categories/:id
// @access public
const getCategory = handlers.getOne(CategoryModel);

// @desc Create Category
// @route POST /api/v1/categories
// @access private
const addCategories = handlers.createOne(CategoryModel);

// @desc Update Specific Category
// @route PUT /api/v1/categories/:id
// @access Private
const updateCategory = handlers.updateOne(CategoryModel);

// @desc Delete Specific Category
// @route Delete /api/v1/categories/:id
// @access Private
const deleteCategory = handlers.deleteOne(CategoryModel);

module.exports = {
  addCategories,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
