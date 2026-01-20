const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Required"],
      unique: [true, "Category Must Be Unique"],
      minlength: [3, "To Short Category Name"],
      maxlength: [32, "To Long Category Name"],
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

//Set ImageURL
const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

categorySchema.post("init", (doc) => {
  setImageURL(doc);
});

categorySchema.post("save", (doc) => {
  setImageURL(doc);
});

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
