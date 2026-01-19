const brandModel = require("../Schema/brandSchema");
const handlers = require("./handlers");

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

module.exports = { addBrands, getBrands, getBrand, updateBrand, deleteBrand };
