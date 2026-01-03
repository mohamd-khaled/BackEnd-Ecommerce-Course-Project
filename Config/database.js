const mongoose = require("mongoose")

const dbConnection = () => {
mongoose.connect(process.env.MONGO_URI).then((conn) => {
    console.log("Connected to DB")
    })
    // .catch((error) => {
    //     console.error(`DB error: ${error}`)
    // })
    
;

}

module.exports = dbConnection;