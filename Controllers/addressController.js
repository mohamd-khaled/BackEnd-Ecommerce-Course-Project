const asyncHandler = require("express-async-handler");

const userModel = require("../Schema/userSchema");


// @desc Add address To user
// @route POST /api/v1/address
// @access Private/user
exports.addAddress = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, {
        $addToSet: {addresses: req.body}
    },{new: true});

    res.status(200).json({status: "success", message: "Address added successfully", data: user.addresses});
});

// @desc Remove address To user
// @route delete /api/v1/address
// @access Private/user
exports.removeAddress = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, {
        $pull: {addresses: req.params.addressId}
    },{new: true});

    res.status(200).json({status: "success", message: "Address Removed successfully", data: user.addresses});
});




// @desc Get User address
// @route GET /api/v1/address
// @access Private/user
exports.getAddress = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id).populate("addresses");

    res.status(200).json({status: "success",results: user.addresses.length, data: user.addresses});
});