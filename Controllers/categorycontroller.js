const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const asyncHandler = require("express-async-handler");
const handlers = require("./handlers");
const uploadImage = require("../middlewares/uploadImageMiddleWare");
const CategoryModel = require("../Schema/categorySchema");

// Resize Image
const resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (!req.file) {
    return next();
  }

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);

  // Save image into our DB
  req.body.image = fileName;
  next();
});

//upload Category Image
const uploadCategoryImage = uploadImage.uploadSingleImage("image");

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
  uploadCategoryImage,
  resizeImage,
};
