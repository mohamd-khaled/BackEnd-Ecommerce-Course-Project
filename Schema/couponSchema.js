const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Coupon name is required"],
            unique: true,
            trim: true,
        },
        expire: {
            type: Date,
            required: [true, "Expire date is required"],
        },
        discount: {
            type: Number,
            required: [true, "Discount value is required"],
        },
}, {timestamps: true}
)

const couponModel = mongoose.model("Coupon", couponSchema);

module.exports = couponModel;