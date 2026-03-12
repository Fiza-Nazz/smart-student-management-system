// ============================================================
// DATABASE CONFIGURATION
// MongoDB connection with Mongoose
// ============================================================

"use strict";

const mongoose = require("mongoose");
const logger = require("../utils/logger");

/**
 * Connects to MongoDB with retry logic and event listeners.
 * Uses environment variable MONGODB_URI for the connection string.
 */
const connectDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/berry_school_db";

    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            // These options ensure a robust connection
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000,          // Close sockets after 45s of inactivity
        });

        logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
        logger.info(`📦 Database: ${conn.connection.name}`);

        // Monitor connection events
        mongoose.connection.on("error", (err) => {
            logger.error(`MongoDB connection error: ${err.message}`);
        });

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected. Attempting to reconnect...");
        });

        mongoose.connection.on("reconnected", () => {
            logger.info("MongoDB reconnected successfully.");
        });

    } catch (error) {
        logger.error(`❌ MongoDB Connection Failed: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
