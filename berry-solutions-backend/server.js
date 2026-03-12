// ============================================================
// BERRY SOLUTIONS - SCHOOL MANAGEMENT SYSTEM
// Main Server Entry Point
// ============================================================

"use strict";

// Load environment variables FIRST before any other imports
require("dotenv").config();

// Handle uncaught exceptions early
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("express-async-errors"); // Auto-catches async errors

const connectDB = require("./src/config/database");
const logger = require("./src/utils/logger");
const errorHandler = require("./src/middleware/errorHandler");
const notFoundHandler = require("./src/middleware/notFoundHandler");

// Route imports
const studentRoutes = require("./src/routes/studentRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");

// WhatsApp Service (initializes on startup)
const { initializeWhatsApp } = require("./src/services/whatsappService");

// ============================================================
// Initialize Express App
// ============================================================
const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || "v1";

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

// Set secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API
}));

// Enable CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

app.use("/api/", limiter);

// ============================================================
// REQUEST PARSING MIDDLEWARE
// ============================================================
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// HTTP request logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// ============================================================
// HEALTH CHECK ENDPOINT
// ============================================================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "Berry Solutions School Management API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// API root info
app.get(`/api/${API_VERSION}`, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Berry Solutions School Management API",
    version: "1.0.0",
    documentation: `http://localhost:${PORT}/api/${API_VERSION}/docs`,
    endpoints: {
      students: `/api/${API_VERSION}/students`,
      attendance: `/api/${API_VERSION}/attendance`,
      notifications: `/api/${API_VERSION}/notifications`,
    },
  });
});

// ============================================================
// API ROUTES
// ============================================================
app.use(`/api/${API_VERSION}/students`, studentRoutes);
app.use(`/api/${API_VERSION}/attendance`, attendanceRoutes);
app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);

// ============================================================
// ERROR HANDLING MIDDLEWARE (must be LAST)
// ============================================================
app.use(notFoundHandler);
app.use(errorHandler);

// ============================================================
// START SERVER
// ============================================================
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`
╔════════════════════════════════════════════════╗
║     BERRY SOLUTIONS SCHOOL MANAGEMENT API      ║
╠════════════════════════════════════════════════╣
║  Status  : Running ✓                          ║
║  Port    : ${PORT}                              ║
║  Mode    : ${(process.env.NODE_ENV || "development").padEnd(30)} ║
║  API     : /api/${API_VERSION}                         ║
╚════════════════════════════════════════════════╝
      `);
    });

    // Initialize WhatsApp client (non-blocking)
    initializeWhatsApp().catch((err) => {
      logger.warn("WhatsApp initialization failed:", err.message);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      logger.error("UNHANDLED REJECTION! Shutting down...");
      logger.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown on SIGTERM
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        logger.info("Process terminated!");
      });
    });

  } catch (error) {
    logger.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app; // Export for testing
