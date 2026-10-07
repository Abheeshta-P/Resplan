// server create and middlewares config and export the server

const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

// require all the routes here 
const authRouter = require("./routes/auth.routes")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"https://opulent-invention-v6xg44vjgxqgfqg7-5173.app.github.dev",
    credentials: true
}))
// using all the routes here 
app.use("/api/auth", authRouter)

module.exports = app