const subCategoryModel = require("../Schema/subCategorySchema");
const handlers = require("./handlers");

const createFilterObject = (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) {
    filterObj = { category: req.params.categoryId };
  }
  req.filterObj = filterObj;
  next();
};

const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.categoryId) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// GET /api/v1/categories/:categoryId/subcategories
// @desc Get SubCategories
// @route GET /api/v1/subcategories
// @access public
const getSubCategories = handlers.getAll(subCategoryModel);

// @desc Get Specific SubCategory
// @route GET /api/v1/subcategories/:id
// @access public
const getSubCategory = handlers.getOne(subCategoryModel);

// @desc Create SubCategory
// @route POST /api/v1/subcategories
// @access private
const addSubCategories = handlers.createOne(subCategoryModel);

// @desc Update Specific Category
// @route PUT /api/v1/categories/:id
// @access Private
const updateSubCategory = handlers.updateOne(subCategoryModel);

// @desc Delete Specific Category
// @route Delete /api/v1/categories/:id
// @access Private
const deleteSubCategory = handlers.deleteOne(subCategoryModel);

module.exports = {
  addSubCategories,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObject,
};
