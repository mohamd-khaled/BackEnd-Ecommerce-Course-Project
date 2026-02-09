const asyncHandler = require("express-async-handler");

const userModel = require("../Schema/userSchema");


// @desc Add Product To Wishlist
// @route POST /api/v1/wishlist
// @access Private/user
exports.addToWishlist = asyncHandler(async (req, res, next) => {

    const user = await userModel.findByIdAndUpdate(req.user._id, {
        $addToSet: {wishlist: req.body.product}
    },{new: true});


    res.status(200).json({status: "success", message: "product added successfully", data: user.wishlist});
});


// @desc Remove Product From Wishlist
// @route Delete /api/v1/wishlist/:id
// @access Private/user
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
    
    const user = await userModel.findByIdAndUpdate(req.user._id, {
        $pull: {wishlist: req.params.id}
    },{new: true});


    res.status(200).json({status: "success", message: "product removed successfully", data: user.wishlist});
});



// @desc Get User Wishlist
// @route GET /api/v1/wishlist
// @access Private/user
exports.getWishlist = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id).populate("wishlist");

    res.status(200).json({status: "success",results: user.wishlist.length, data: user.wishlist});
});