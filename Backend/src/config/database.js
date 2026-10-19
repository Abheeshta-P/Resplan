const mongoose = require("mongoose");

let isConnected = false;

async function connectToDB() {
    if (isConnected || mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is missing in server configuration.");
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

module.exports = connectToDB;