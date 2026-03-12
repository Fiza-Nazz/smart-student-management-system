// ============================================================
// GLOBAL ERROR HANDLER MIDDLEWARE
// ============================================================

const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log for developer
    logger.error(`${err.name}: ${err.message}`);

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found with id of ${err.value}`;
        return res.status(404).json({ success: false, error: message });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate field value entered: ${field}. Please use another value.`;
        return res.status(400).json({ success: false, error: message });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message);
        return res.status(400).json({ success: false, error: message });
    }

    // Default to 500 server error
    res.status(err.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

module.exports = errorHandler;
