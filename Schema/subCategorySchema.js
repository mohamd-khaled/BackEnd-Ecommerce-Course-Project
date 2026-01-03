const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({

        name: {
            type: String,
            trim: true,
            required: [true, "Category Required"],
            unique: [true, "SubCategory Must Be Unique"],
            minlength: [2, "To Short SubCategory Name"],
            maxlength: [32, "To Long SubCategory Name"],
        },

        //to but "-" in url and make the uppercase to lowercase
        slug: {
            type: String,
            lowercase: true,
        },

        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: [true, "SubCategory Must To Belong To Main Category"],
        }

}, {timestamps: true})


module.exports = mongoose.model("SubCategory", subCategorySchema)