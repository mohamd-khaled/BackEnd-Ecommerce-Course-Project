const ApiError = require("../utils/apierror");

const sendErrorForDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorForProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
const handleJWTErrorSignature = () => {
  // eslint-disable-next-line no-new
  new ApiError("Invalid Token. Please log in again", 401);
};

const handleJWTErrorExpired = () => {
  // eslint-disable-next-line no-new
  new ApiError("Token Expired. Please log in again", 401);
};

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJWTErrorSignature();
    if (err.name === "TokenExpiredError") err = handleJWTErrorExpired();
    sendErrorForProd(err, res);
  }
};
module.exports = globalError;
