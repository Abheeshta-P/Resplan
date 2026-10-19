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

// Trigger non-blocking background connection attempt on cold start
connectToDB().catch(err => console.error("Initial DB connection note:", err.message))


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

const mongoose = require("mongoose")

// Helper to safely unwrap routers across CJS and ESM bundling
const getRouter = (r) => {
    if (typeof r === "function") return r;
    if (r && typeof r.default === "function") return r.default;
    return null;
};

// Health check endpoint for uptime/monitoring (does not require DB)
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Diagnostic endpoint to check environment variables and DB connection state
app.get("/api/db-status", async (req, res) => {
    const hasUri = !!process.env.MONGODB_URI;
    const uriPreview = process.env.MONGODB_URI
        ? process.env.MONGODB_URI.replace(/:([^:@]+)@/, ":****@")
        : "NOT_SET";

    let dbError = null;
    try {
        await connectToDB();
    } catch (err) {
        dbError = err.message;
    }

    res.status(200).json({
        database: {
            hasUri,
            uriPreview,
            readyState: mongoose.connection.readyState,
            state: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "unknown",
            error: dbError
        },
        env: {
            hasJwtSecret: !!process.env.JWT_SECRET,
            hasGeminiKey: !!process.env.GOOGLE_GENAI_API_KEY
        }
    });
});

// Ensure DB is connected for incoming API requests
app.use(async (req, res, next) => {
    try {
        await connectToDB();
        next();
    } catch (error) {
        console.error("Database connection failure on request:", error.message);
        return res.status(500).json({
            success: false,
            message: "Database connection failed",
            details: error.message
        });
    }
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

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Application Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;
module.exports.default = app;