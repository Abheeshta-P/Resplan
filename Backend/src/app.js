// server create and middlewares config and export the server
require("dotenv").config()

const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const connectToDB = require("./config/database")

const mongoose = require("mongoose")

// Safely require routes with try/catch
let authRouter = null, authRequireError = null;
try {
    authRouter = require("./routes/auth.routes");
} catch (err) {
    authRequireError = err;
    console.error("Critical: Failed to require auth.routes:", err);
}

let interviewRouter = null, interviewRequireError = null;
try {
    interviewRouter = require("./routes/interview.routes");
} catch (err) {
    interviewRequireError = err;
    console.error("Critical: Failed to require interview.routes:", err);
}

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

// Helper to safely unwrap routers across CJS and ESM bundling
const getRouter = (r) => {
    if (typeof r === "function") return r;
    if (!r || typeof r !== "object") return null;
    if (typeof r.default === "function") return r.default;
    if (typeof r.interviewRouter === "function") return r.interviewRouter;
    if (typeof r.authRouter === "function") return r.authRouter;
    if (typeof r.router === "function") return r.router;
    for (const key of Object.keys(r)) {
        if (typeof r[key] === "function" && (r[key].name === "router" || typeof r[key].use === "function")) {
            return r[key];
        }
    }
    return null;
};

// Health check endpoint for uptime/monitoring (does not require DB)
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Diagnostic endpoint to check environment variables, DB connection state, and routers
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
        },
        routers: {
            authRouterType: typeof authRouter,
            authHandlerLoaded: !!authHandler,
            interviewRouterType: typeof interviewRouter,
            interviewHandlerLoaded: !!interviewHandler,
            interviewRequireError: interviewRequireError ? interviewRequireError.message : null
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
        res.status(500).json({
            error: "Auth service unavailable",
            details: authRequireError ? authRequireError.message : "Router was not a function",
            type: typeof authRouter,
            keys: authRouter && typeof authRouter === "object" ? Object.keys(authRouter) : []
        });
    });
}

const interviewHandler = getRouter(interviewRouter);
if (interviewHandler) {
    app.use("/api/interview", interviewHandler);
} else {
    console.error("Critical: interviewRouter is not a function:", typeof interviewRouter, interviewRouter);
    app.use("/api/interview", (req, res) => {
        res.status(500).json({
            error: "Interview service unavailable",
            details: interviewRequireError ? interviewRequireError.message : "Router was not a function",
            type: typeof interviewRouter,
            keys: interviewRouter && typeof interviewRouter === "object" ? Object.keys(interviewRouter) : []
        });
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