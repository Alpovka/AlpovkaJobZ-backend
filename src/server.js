require("dotenv").config()
require("./config/dbConnect")()
const cors = require('cors');
const colors = require("colors")
const express = require("express")
const { errorHandler } = require('./middlewares/errorMiddleWare')

const app = express()
const port = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/api/offers", require("./routes/offerRoutes"))
app.use("/api/users", require("./routes/userRoutes"))
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))