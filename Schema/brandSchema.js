const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand Required"],
      unique: [true, "Brand Must Be Unique"],
      minlength: [3, "To Short Brand Name"],
      maxlength: [32, "To Long Brand Name"],
    },

    //to but "-" in url and make the uppercase to lowercase
    slug: {
      type: String,
      lowercase: true,
    },

    image: String,
  },
  { timestamps: true }
);

const brandModel = mongoose.model("Brand", brandSchema);

module.exports = brandModel;
