require("dotenv").config()
require("./config/dbConnect")()
const cors = require('cors');
const colors = require("colors")
const express = require("express");
const { errorHandler } = require('./middlewares/errorMiddleWare');
const connectDB = require("./config/dbConnect");

const app = express()
const port = process.env.PORT || 5000

// UI for Node.js
app.set("view engine", "ejs")

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/api/offers", require("./routes/offerRoutes"))
app.use("/api/users", require("./routes/userRoutes"))
app.use(errorHandler)

connectDB().then(() => {
    app.listen(port, () => console.log(`Server started on port ${port}`))
})