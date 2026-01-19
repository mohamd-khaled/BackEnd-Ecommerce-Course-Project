const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apierror");
const ApiFeatures = require("../utils/apiFeatures");

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const countDocuments = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(req.query, Model.find(filter))
      .paginate(countDocuments)
      .filter()
      .limitFields()
      .search()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(201)
      .json({ results: documents.length, paginationResult, data: documents });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(
        new ApiError(`No Document for this ID: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(200).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(
        new ApiError(`No Document for this ID: ${req.params.id}`, 404)
      );
    }
    res.status(204).json({ msg: "Document Deleted" });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No Document for this ID: ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });
