const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    cartItem: [{
        product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"],
        },
        quantity: {
            type: Number,
            default: 1,
        },
        color: {
            type: String,
        },
        price: {
            type: Number,
        }
    }],

    totalCartPrice: {
        type: Number,
    },

    totalCartPriceAfterDiscount: Number,

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },

}, { timestamps: true });

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;