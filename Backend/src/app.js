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

// Connect to MongoDB
connectToDB()

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
    "https://resplans.vercel.app",
    "https://opulent-invention-v6xg44vjgxqgfqg7-5173.app.github.dev",
    "http://localhost:5173"
]

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like same-origin, curl, or mobile)
        if (!origin) return callback(null, true)

        const isAllowed = allowedOrigins.includes(origin) ||
                          origin.endsWith(".vercel.app") ||
                          origin.endsWith(".app.github.dev")

        if (isAllowed) {
            return callback(null, true)
        } else {
            return callback(null, false)
        }
    },
    credentials: true
}))

// using all the routes here 
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app