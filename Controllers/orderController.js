const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apierror");

const handlers = require("./handlers");
const orderModel = require("../Schema/orderSchema");
const cartModel = require("../Schema/cartSchema");
const productModel = require("../Schema/productSchema");


// @desc    Create Cash Orders
// @route   POST /api/v1/orders/cartId
// @access  Private/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
    // app setting
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1- Get Cart based on cartId
    const cart = await cartModel.findById(req.params.cartId);
    if (!cart) {
        return next(new ApiError(`No Cart found for this id: ${req.params.cartId}`, 404));
    }
    // 2- Get order price depend on cart price (check if coupon applied or not)
    const cartPrice = cart.totalCartPriceAfterDiscount ? cart.totalCartPriceAfterDiscount : cart.totalCartPrice;
    
    const totalPrice = cartPrice + taxPrice + shippingPrice; 
    // 3- Create order with status "Cash on Delivery"
    const order = await orderModel.create({
        user: req.user._id,
        cartItems: cart.cartItem,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice: totalPrice,
        paymentMethod: "Cash on Delivery",
    }); 
    // 4- Decrement Product quantity, increment product sold
    if(order){
        const bulkOption = cart.cartItem.map((item) => ({
            updateOne: {
                filter: {_id: item.product},
                update: {$inc: {quantity: -item.quantity, sold: +item.quantity}}
            }
        }));
        await productModel.bulkWrite(bulkOption,{})
        // 5- Clear Cart
        await cartModel.findByIdAndDelete(req.params.cartId);
    }

    res.status(201).json({
        status: "success",
        data: order,
    });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if (req.user.role === "user") {
        req.filterObj = { user: req.user._id };
    }
    next();
});

// @desc    Get All Orders
// @route   Get /api/v1/orders
// @access  Private/User-Admin-Manager
exports.getAllOrders = handlers.getAll(orderModel);

// @desc    Get Specific Order
// @route   Get /api/v1/orders/:id
// @access  Private/User-Admin-Manager
exports.getSpecificOrder = handlers.getOne(orderModel);

// @desc    update Order payment status to paid
// @route   Put /api/v1/orders/:id/pay
// @access  Private/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
        return next(new ApiError(`No Order found for this id: ${req.params.id}`, 404));
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    
    res.status(200).json({status: "success", data: updatedOrder});
});

// @desc    update Order payment status to paid
// @route   Put /api/v1/orders/:id/deliver
// @access  Private/Admin-Manager
exports.updateOrderToDeliver = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
        return next(new ApiError(`No Order found for this id: ${req.params.id}`, 404));
    }
    order.orderStatus = "Delivered";
    const updatedOrder = await order.save();
    
    res.status(200).json({status: "success", data: updatedOrder});
});