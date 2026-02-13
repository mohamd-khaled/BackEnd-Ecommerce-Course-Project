// Requires Moduels
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan"); //for logs
const cors = require("cors");
const path = require("path");
const compression = require('compression')

dotenv.config({ path: "config.env" }); //if the fle named something other than ".env" we must add path:"filename"
const dbConnection = require("./Config/database");

const mountRoutes = require("./Routes");



const ApiError = require("./utils/apierror");
const globalError = require("./middlewares/errorMiddleware");
// connect with DB
dbConnection();

//Express APP
const app = express();
app.use(cors()); // Enable CORS for all routes

app.use(compression()); // Compress all routes responses

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`MODE: ${process.env.NODE_ENV}`);
}

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
