// Requires Moduels
const express =  require("express");
const dotenv = require("dotenv");

dotenv.config({path:"config.env"}) //if the fle named something other than ".env" we must add path:"filename"
const morgan = require("morgan")  //for logs
const dbConnection = require("./Config/database");
const categoryRoute = require("./Routes/categoryRoute");
const subCategoryRoute = require("./Routes/subCategoryRoute");

const ApiError = require("./utils/apierror")
const globalError = require("./middlewares/errorMiddleware")
// connect with DB
dbConnection();

//Express APP
const app = express();

// Middleware
app.use(express.json());

if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
    console.log(`MODE: ${process.env.NODE_ENV}`)
}

// Mount Route
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);


app.use((req, res, next)=>{
    next(new ApiError(`Can't Find This Route: ${req.originalUrl}`, 400));
})

//Error Handle Middleware
app.use(globalError)

const {PORT} = process.env
const server = app.listen(PORT,  () => {
    console.log(`app run on port: ${PORT}`)
})


// Handle Rejections outside express
process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection error: ${err.name} | ${err.message}`);
    server.close(() => {
        console.log(`Shutting down...`);
        process.exit(1);
    });
});