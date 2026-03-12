// ============================================================
// BERRY SOLUTIONS - JEST TEST SUITE
// General: Middleware, Error Handling & Project Files Tests
// ============================================================

"use strict";

const fs = require("fs");

describe("General: Middleware & Error Handling", () => {

  describe("Error Handler Middleware", () => {
    it("should export a function with 4 parameters (err, req, res, next)", () => {
      const eh = require("../src/middleware/errorHandler");
      expect(typeof eh).toBe("function");
      expect(eh.length).toBe(4);
    });

    it("should handle CastError, duplicate key (11000), and ValidationError", () => {
      const content = fs.readFileSync("./src/middleware/errorHandler.js", "utf-8");
      expect(content).toContain("CastError");
      expect(content).toContain("11000");
      expect(content).toContain("ValidationError");
    });
  });

  describe("Not Found Handler Middleware", () => {
    it("should export a function", () => {
      const nfh = require("../src/middleware/notFoundHandler");
      expect(typeof nfh).toBe("function");
    });
  });

  describe("Logger Utility", () => {
    it("should export logger with info, error, warn methods", () => {
      const logger = require("../src/utils/logger");
      expect(typeof logger.info).toBe("function");
      expect(typeof logger.error).toBe("function");
      expect(typeof logger.warn).toBe("function");
    });
  });
});

describe("General: Project Files", () => {

  describe("server.js", () => {
    it("should export Express app and use all core middleware", () => {
      const content = fs.readFileSync("./server.js", "utf-8");
      expect(content).toContain("module.exports = app");
      expect(content).toContain("helmet");
      expect(content).toContain("cors");
      expect(content).toContain("rateLimit");
      expect(content).toContain("/health");
      expect(content).toContain("express-async-errors");
    });
  });

  describe("Database Config", () => {
    it("should connect using MONGODB_URI env variable", () => {
      const content = fs.readFileSync("./src/config/database.js", "utf-8");
      expect(content).toContain("MONGODB_URI");
      expect(content).toContain("mongoose.connect");
      expect(content).toContain("berry_school_db");
    });
  });

  describe(".env.example", () => {
    it("should have all required environment variables", () => {
      const env = fs.readFileSync("./.env.example", "utf-8");
      expect(env).toContain("PORT");
      expect(env).toContain("MONGODB_URI");
      expect(env).toContain("JWT_SECRET");
      expect(env).toContain("OPENAI_API_KEY");
      expect(env).toContain("WHATSAPP_SESSION_PATH");
    });
  });

  describe(".gitignore", () => {
    it("should ignore sensitive files and folders", () => {
      const gi = fs.readFileSync("./.gitignore", "utf-8");
      expect(gi).toContain("node_modules");
      expect(gi).toContain(".env");
      expect(gi).toContain("logs");
      expect(gi).toContain("whatsapp-session");
    });
  });

  describe("README.md", () => {
    it("should have complete documentation", () => {
      const readme = fs.readFileSync("./README.md", "utf-8");
      expect(readme).toContain("Berry Solutions");
      expect(readme).toContain("npm install");
      expect(readme).toContain("API Documentation");
      expect(readme).toContain("POST");
      expect(readme).toContain("GET");
    });
  });

  describe("POSTMAN_DOCS.md", () => {
    it("should have API testing guide for all sections", () => {
      const postman = fs.readFileSync("./POSTMAN_DOCS.md", "utf-8");
      expect(postman).toContain("Student Management");
      expect(postman).toContain("Attendance");
      expect(postman).toContain("Notification");
      expect(postman).toContain("rfidCardId");
    });
  });
});
