const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const asyncHandler = require("express-async-handler");
const productModel = require("../Schema/productSchema");
const handlers = require("./handlers");
const uploadImage = require("../middlewares/uploadImageMiddleWare");

//upload Product Image
const uploadProductImage = uploadImage.uploadMultiImage([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// Resize Image
const resizeImage = asyncHandler(async (req, res, next) => {
  console.log(req.files);
  // Image Cover Processing
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our DB
    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const fileName = `product-${uuidv4()}-${Date.now()}-${index}.jpeg`;

        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${fileName}`);

        // Save image into our DB
        req.body.images.push(fileName);
      })
    );
    next();
  }
});

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
  uploadProductImage,
  resizeImage,
};
