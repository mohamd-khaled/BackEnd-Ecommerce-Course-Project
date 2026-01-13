const qs = require("qs");

class ApiFeatures {
  constructor(queryString, productQuery) {
    this.queryString = queryString;
    this.productQuery = productQuery;
  }

  filter() {
    // Filtering
    const parsedQuery = qs.parse(this.queryString);

    const queryObj = { ...parsedQuery };
    console.log("Original Query Object:", queryObj);
    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Advanced Filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    console.log("Filter Query:", queryString);
    console.log("Filter Query:", JSON.parse(queryString));

    this.productQuery = this.productQuery.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.productQuery = this.productQuery.sort(
        this.queryString.sort.split(",").join(" ")
      );
    } else {
      this.productQuery = this.productQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.productQuery = this.productQuery.select(fields);
    } else {
      this.productQuery = this.productQuery.select("-__v");
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      // Add $or to the existing filter object if present, else create a new one
      const keywordQuery = {
        $or: [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ],
      };
      // Merge with existing query conditions
      this.productQuery = this.productQuery.find(keywordQuery);
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 5 || 50;
    const skip = (page - 1) * limit;
    this.productQuery = this.productQuery.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
