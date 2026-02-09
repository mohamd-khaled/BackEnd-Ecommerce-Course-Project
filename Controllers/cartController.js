const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apierror");

const cartModel = require("../Schema/cartSchema");
const productModel = require("../Schema/productSchema");
const couponModel = require("../Schema/couponSchema");

const calcTotalCartPrice = (cart) => {
    let totalCartPrice = 0;
    cart.cartItem.forEach((item) => {
        totalCartPrice += item.price * item.quantity;
    });
    return totalCartPrice;
}

// @desc   add product to Cart
// @route  POST /api/v1/cart
// @access Private/User
exports.addToCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity, color } = req.body;
    const product = await productModel.findById(productId);
    // Get Cart for logged user 
    let cart = await cartModel.findOne({ user: req.user._id });

    
    if (!cart) {
        // 1- if user dose not have cart => create new cart for him
        cart = await cartModel.create({
            user: req.user._id,
            cartItem: [{
                product: productId,
                quantity: quantity,
                color: color,
                price: product.price  }]
        });
        
    }else {
        // 2- if user have cart and the product in it => update the quantity of this product
        const productIndex = cart.cartItem.findIndex(
            item => item.product.toString() === productId && item.color === color);

        if (productIndex > -1) { // if product exist in cart => update quantity
            const item = cart.cartItem[productIndex];
            item.quantity += 1;
            cart.cartItem[productIndex] = item;
        }else {  // 3- if user have cart and the product not in it => add this product to cart
            cart.cartItem.push({
                product: productId,
                quantity: quantity,
                color: color,
                price: product.price
            });
        }
    }


    // Calculate total cart price
    cart.totalCartPrice = calcTotalCartPrice(cart);
    cart.totalCartPriceAfterDiscount = undefined; // if we add new item to cart we must remove the discount because the total price is changed
    await cart.save();

    res.status(200).json({
        status: "success",
        message: "Product added to cart successfully",
        data: cart,
    });
});

// @desc   get user Cart
// @route  get /api/v1/cart
// @access Private/User
exports.getUserCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError("There is no Cart for this user", 404));
    }

    res.status(200).json({
        status: "success",
        data: cart,
    });
});

// @desc   Delete item from Cart
// @route  Delete /api/v1/cart/:id
// @access Private/User
exports.deleteItemFromCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate(
        {user: req.user._id},
        {$pull: {cartItem: {_id: req.params.id}}},
        {new: true}
    );

        // Calculate total cart price
    cart.totalCartPrice = calcTotalCartPrice(cart);
    cart.totalCartPriceAfterDiscount = undefined; // if we delete cart item we must remove the discount because the total price is changed
    await cart.save();

    res.status(200).json({
        status: "success",
        message: "Product Removed From cart successfully",
        data: cart,
    });
});

// @desc   Clear all items from Cart
// @route  Delete /api/v1/cart/
// @access Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
    await cartModel.findOneAndDelete({user: req.user._id});
    res.status(204).send("Cart Cleared successfully");
});

// @desc   Update item in Cart
// @route  PUT /api/v1/cart/:id
// @access Private/User
exports.updateItemInCart = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;
    const cart = await cartModel.findOne({user: req.user._id});
    if(!cart) {
        return next(new ApiError("There is no Cart for this user", 404));
    }

    const productIndex = cart.cartItem.findIndex(
        item => item._id.toString() === req.params.id);

    if (productIndex > -1) {
        const item = cart.cartItem[productIndex];
        item.quantity = quantity;
        cart.cartItem[productIndex] = item;
    }else{
        return next(new ApiError("There is no item with this id in cart", 404));
    }

    // Calculate total cart price
    cart.totalCartPrice = calcTotalCartPrice(cart);
    cart.totalCartPriceAfterDiscount = undefined; // if we update cart item we must remove the discount because the total price is changed
    await cart.save();

    res.status(200).json({
        status: "success",
        message: "Product Updated in cart successfully",
        data: cart,
    });

});


// @desc   Applay coupon on Cart
// @route  PUT /api/v1/cart/
// @access Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
    // 1- Get coupon from req.body and check if it valid
    const coupon = await couponModel.findOne({ name: req.body.coupon, expire: {$gt: Date.now()}});

    if(!coupon) {
        return next(new ApiError("Invalid coupon", 400));
    }

    // 2- Get user cart to get total price for this cart
    const cart = await cartModel.findOne({user: req.user._id});

    if(!cart) {
        return next(new ApiError("There is no Cart for this user", 404));
    }

    // 3- Calculate total price after apply discount
    const totalPriceAfterDiscount = (cart.totalCartPrice - (cart.totalCartPrice * coupon.discount / 100)).toFixed(2);
    cart.totalCartPriceAfterDiscount = totalPriceAfterDiscount;

    await cart.save();

    res.status(200).json({
        status: "success",
        message: "Coupon applied successfully",
        data: cart,
    });
});