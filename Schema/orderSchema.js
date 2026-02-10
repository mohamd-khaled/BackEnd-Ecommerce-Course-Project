const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },

        cartItems: [{
                product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product is required"],
                },
                quantity: {
                    type: Number,
                },
                color: {
                    type: String,
                },
                price: {
                    type: Number,
                }
            }],

        taxPrice: {
            type: Number,
            default: 0,
        },
        
        shippingAddress: {
            details: String,
            phone: String,
        },

        shippingPrice: {
            type: Number,
            default: 0,
        },

        totalOrderPrice: {
            type: Number,
        },

        orderStatus: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },

        isPaid: {
            type: Boolean,
            default: false,
        },

        paymentMethod: {
            type: String,
            enum: ["Cash on Delivery", "Card"],
            default: "Cash on Delivery",
        },

        paidAt: Date,
    }, { timestamps: true }
);


orderSchema.pre(/^find/, function () {
    this.populate({path: "user", select: "name email phone"}).populate({path: "cartItems.product", select: "title imageCover price"});
});
const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;