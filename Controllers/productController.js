const productModel = require("../Schema/productSchema");
const handlers = require("./handlers");

// @desc Get Products
// @route GET /api/v1/products
// @access public
const getProducts = handlers.getAll(productModel);

// @desc Get Specific Product
// @route GET /api/v1/products/:id
// @access public
const getProduct = handlers.getOne(productModel);

// @desc Create Product
// @route POST /api/v1/products
// @access private
const addProducts = handlers.createOne(productModel);

// @desc Update Specific Product
// @route PUT /api/v1/products/:id
// @access Private
const updateProduct = handlers.updateOne(productModel);

// @desc Delete Specific Product
// @route Delete /api/v1/products/:id
// @access Private
const deleteProduct = handlers.deleteOne(productModel);

module.exports = {
  addProducts,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
