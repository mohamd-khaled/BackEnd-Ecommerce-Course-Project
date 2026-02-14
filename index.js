// Requires Moduels
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan"); //for logs
const cors = require("cors");
const path = require("path");
const compression = require('compression')
const hpp = require("hpp");
const mongoSanitize = require('express-mongo-sanitize');

// Load from config.env only if not in production (Railway sets vars differently)
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "config.env" });
} else if (!process.env.STRIPE_SECRET) {
  // Fallback for production if needed
  dotenv.config({ path: "config.env" });
}

const dbConnection = require("./Config/database");
const mountRoutes = require("./Routes");
const ApiError = require("./utils/apierror");
const globalError = require("./middlewares/errorMiddleware");
// connect with DB
dbConnection();

//Express APP
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes

app.use(compression()); // Compress all routes responses

app.use(express.json({
  limit: "10kb", // Limit the size of incoming JSON payloads to 10KB
}));
// app.use(mongoSanitize());  // To remove data using these defaults

app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`MODE: ${process.env.NODE_ENV}`);
}


app.use(hpp({ whitelist: ["price", "sold", "quantity", "ratingsAverage", "ratingsQuantity"] })); // Prevent HTTP Parameter Pollution



// Mount Route
mountRoutes(app);

app.use((req, res, next) => {
  next(new ApiError(`Can't Find This Route: ${req.originalUrl}`, 400));
});

//Error Handle Middleware
app.use(globalError);

const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`app run on port: ${PORT}`);
});

// Handle Rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log(`Shutting down...`);
    process.exit(1);
  });
});
