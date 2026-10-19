// server create and middlewares config and export the server
require("dotenv").config()

const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const connectToDB = require("./config/database")

// require all the routes here 
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

const app = express()

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
    "https://resplans.vercel.app",
    "https://opulent-invention-v6xg44vjgxqgfqg7-5173.app.github.dev",
    "http://localhost:5173"
]

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps, curl, or same-origin)
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true)
        }
        return callback(null, true)
    },
    credentials: true
}))

// Connect to DB before handling requests (crucial for Vercel serverless)
app.use(async (req, res, next) => {
    try {
        await connectToDB()
        next()
    } catch (err) {
        return res.status(500).json({
            message: "Database connection failed. Please check MONGODB_URI in environment variables.",
            error: err.message
        })
    }
})

// using all the routes here 
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app