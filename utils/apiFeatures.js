const qs = require("qs");

class ApiFeatures {
  constructor(queryString, mongooseQuery) {
    this.queryString = queryString;
    this.mongooseQuery = mongooseQuery;
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

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.mongooseQuery = this.mongooseQuery.sort(
        this.queryString.sort.split(",").join(" ")
      );
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      // Add $or to the existing filter object if present, else create a new one
      const keywordQuery = {
        $or: [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ],
      };
      // Merge with existing query conditions
      this.mongooseQuery = this.mongooseQuery.find(keywordQuery);
    }
    return this;
  }

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 5 || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};

    // Add pagination info
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    //nextpage
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }

    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
