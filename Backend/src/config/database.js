const mongoose = require("mongoose");

let cachedPromise = null;

async function connectToDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables. Please add MONGODB_URI in Vercel project settings.");
    }

    if (mongoose.connection.readyState === 2) {
        await mongoose.connection.asPromise();
        return mongoose.connection;
    }

    if (!cachedPromise) {
        cachedPromise = mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            bufferCommands: false
        }).catch(err => {
            cachedPromise = null;
            throw err;
        });
    }

    await cachedPromise;
    console.log("Connected to MongoDB");
    return mongoose.connection;
}


module.exports = connectToDB;