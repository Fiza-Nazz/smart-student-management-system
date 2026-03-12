// ============================================================
// WINSTON LOGGER UTILITY
// Centralized logging for the entire application
// ============================================================

"use strict";

const winston = require("winston");
const path = require("path");

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        return stack
            ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
            : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
);

// Console format with colors
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    logFormat
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: logFormat,
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: consoleFormat,
            silent: process.env.NODE_ENV === "test",
        }),

        // Write error logs to error.log
        new winston.transports.File({
            filename: path.join("logs", "error.log"),
            level: "error",
            maxsize: 5 * 1024 * 1024,  // 5MB
            maxFiles: 5,
            tailable: true,
        }),

        // Write all logs to combined.log
        new winston.transports.File({
            filename: path.join("logs", "combined.log"),
            maxsize: 5 * 1024 * 1024,  // 5MB
            maxFiles: 5,
            tailable: true,
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: path.join("logs", "exceptions.log") }),
    ],
});

module.exports = logger;
