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

// Helper to safely unwrap routers across CJS and ESM bundling
const getRouter = (r) => {
    if (typeof r === "function") return r;
    if (r && typeof r.default === "function") return r.default;
    return null;
};

// Health check endpoint for uptime/monitoring
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// using all the routes here 
const authHandler = getRouter(authRouter);
if (authHandler) {
    app.use("/api/auth", authHandler);
} else {
    console.error("Critical: authRouter is not a function:", typeof authRouter, authRouter);
    app.use("/api/auth", (req, res) => {
        res.status(500).json({ error: "Auth service unavailable" });
    });
}

const interviewHandler = getRouter(interviewRouter);
if (interviewHandler) {
    app.use("/api/interview", interviewHandler);
} else {
    console.error("Critical: interviewRouter is not a function:", typeof interviewRouter, interviewRouter);
    app.use("/api/interview", (req, res) => {
        res.status(500).json({ error: "Interview service unavailable" });
    });
}

module.exports = app;
module.exports.default = app;