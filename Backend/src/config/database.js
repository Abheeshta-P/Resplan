const mongoose = require("mongoose");

let isConnected = false;

async function connectToDB() {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }


    if (!process.env.MONGODB_URI) {
        console.error("Warning: MONGODB_URI is not defined in environment variables.");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

module.exports = connectToDB;