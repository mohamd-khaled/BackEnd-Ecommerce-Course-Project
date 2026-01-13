const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const productModel = require("../Schema/productSchema");
const ApiError = require("../utils/apierror");
const ApiFeatures = require("../utils/apiFeatures");

// @desc Get Products
// @route GET /api/v1/products
// @access public
const getProducts = asyncHandler(async (req, res) => {
  // Filtering
  // const queryObj = { ...req.query };
  // const excludedFields = ["page", "sort", "limit", "fields"];
  // excludedFields.forEach((field) => delete queryObj[field]);

  // // Advanced Filtering
  // let queryString = JSON.stringify(queryObj);
  // queryString = queryString.replace(
  //   /\b(gte|gt|lte|lt)\b/g, // regular expression to match gte, gt, lte, lt
  //   (match) => `$${match}`
  // );

  // // Pagination
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 5 || 50;
  // const skip = (page - 1) * limit;

  // let productQuery = productModel
  //   .find(JSON.parse(queryString))
  //   .skip(skip)
  //   .limit(limit)
  //   .populate({ path: "category", select: "name" });

  // //Sorting
  // if (req.query.sort) {
  //   productQuery = productQuery.sort(req.query.sort.split(",").join(" "));
  // } else {
  //   productQuery = productQuery.sort("-createdAt");
  // }

  // // Field Limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" ");
  //   productQuery = productQuery.select(fields);
  // } else {
  //   productQuery = productQuery.select("-__v");
  // }

  // // Searching
  // if (req.query.keyword) {
  //   const query = {
  //     $or: [
  //       { title: { $regex: req.query.keyword, $options: "i" } },
  //       { description: { $regex: req.query.keyword, $options: "i" } },
  //     ],
  //   };
  //   productQuery = productModel.find(query);
  // }

  const apiFeatures = new ApiFeatures(req.query, productModel.find())
    .paginate()
    .filter()
    .limitFields()
    .search()
    .sort();
  const products = await apiFeatures.productQuery;
  res.status(201).json({ results: products.length, data: products });

  // Execute Query
  // const products = await productQuery;
  // res.status(201).json({ results: products.length, page, data: products });
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
