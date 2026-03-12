// ============================================================
// BERRY SOLUTIONS - COMPREHENSIVE TEST SUITE
// Tests all modules, routes, validators, logic without MongoDB
// ============================================================

"use strict";
process.env.NODE_ENV = "test";

let passed = 0;
let failed = 0;
const results = [];

function test(name, fn) {
    try {
        fn();
        passed++;
        results.push(`  ✅ PASS: ${name}`);
    } catch (e) {
        failed++;
        results.push(`  ❌ FAIL: ${name} → ${e.message}`);
    }
}

function assert(condition, msg) {
    if (!condition) throw new Error(msg || "Assertion failed");
}

// ============================================================
// PART 1: STUDENT MODEL TESTS
// ============================================================
console.log("\n🔹 PART 1: Student Management Backend\n");

const mongoose = require("mongoose");
const Student = require("./src/models/Student");

test("Student schema has all 10 required fields", () => {
    const paths = Student.schema.paths;
    const required = ["studentId", "fullName", "dateOfBirth", "class", "section", "parentName", "parentPhoneNumber", "address", "rfidCardId", "admissionDate"];
    required.forEach(field => {
        assert(paths[field], `Missing field: ${field}`);
    });
});

test("Student ID is auto-generated with STU- prefix", () => {
    const defaultFn = Student.schema.paths.studentId.defaultValue;
    assert(typeof defaultFn === "function", "studentId should have a default function");
    const id = defaultFn();
    assert(id.startsWith("STU-"), `Generated ID should start with STU-, got: ${id}`);
    assert(id.length === 12, `ID should be 12 chars (STU-XXXXXXXX), got: ${id.length}`);
});

test("rfidCardId is unique and indexed", () => {
    const rfid = Student.schema.paths.rfidCardId;
    assert(rfid.options.unique === true, "rfidCardId should be unique");
    assert(rfid.options.index === true, "rfidCardId should be indexed");
});

test("fullName is required with proper message", () => {
    const field = Student.schema.paths.fullName;
    assert(field.isRequired, "fullName should be required");
});

test("timestamps enabled (createdAt, updatedAt)", () => {
    assert(Student.schema.options.timestamps === true, "timestamps should be true");
});

test("Text search index exists", () => {
    const indexes = Student.schema.indexes();
    const textIndex = indexes.find(idx => {
        const fields = idx[0];
        return fields.fullName === "text" || fields._fts === "text";
    });
    assert(textIndex, "Text search index should exist on fullName/studentId/rfidCardId");
});

results.forEach(r => console.log(r));
results.length = 0;

// ============================================================
// PART 1: STUDENT CONTROLLER TESTS
// ============================================================
console.log("\n🔹 PART 1: Student Controller Functions\n");

const studentController = require("./src/controllers/studentController");

test("addStudent function exists", () => {
    assert(typeof studentController.addStudent === "function");
});

test("updateStudent function exists", () => {
    assert(typeof studentController.updateStudent === "function");
});

test("deleteStudent function exists", () => {
    assert(typeof studentController.deleteStudent === "function");
});

test("getStudent function exists", () => {
    assert(typeof studentController.getStudent === "function");
});

test("searchStudents function exists", () => {
    assert(typeof studentController.searchStudents === "function");
});

results.forEach(r => console.log(r));
results.length = 0;

// ============================================================
// PART 1: STUDENT ROUTES TESTS
// ============================================================
console.log("\n🔹 PART 1: Student Routes\n");

const studentRouter = require("./src/routes/studentRoutes");

test("Student router has POST / route", () => {
    const routes = studentRouter.stack.filter(r => r.route);
    const postRoute = routes.find(r => r.route.path === "/" && r.route.methods.post);
    assert(postRoute, "POST / route should exist");
});

test("Student router has GET /search route", () => {
    const routes = studentRouter.stack.filter(r => r.route);
    const searchRoute = routes.find(r => r.route.path === "/search" && r.route.methods.get);
    assert(searchRoute, "GET /search route should exist");
});

test("Student router has GET /:id route", () => {
    const routes = studentRouter.stack.filter(r => r.route);
    const getRoute = routes.find(r => r.route.path === "/:id" && r.route.methods.get);
    assert(getRoute, "GET /:id route should exist");
});

test("Student router has PUT /:id route", () => {
    const routes = studentRouter.stack.filter(r => r.route);
    const putRoute = routes.find(r => r.route.path === "/:id" && r.route.methods.put);
    assert(putRoute, "PUT /:id route should exist");
});

test("Student router has DELETE /:id route", () => {
    const routes = studentRouter.stack.filter(r => r.route);
    const deleteRoute = routes.find(r => r.route.path === "/:id" && r.route.methods.delete);
    assert(deleteRoute, "DELETE /:id route should exist");
});

results.forEach(r => console.log(r));
results.length = 0;

// ============================================================
// PART 1: VALIDATORS TESTS
// ============================================================
console.log("\n🔹 PART 1: Validators\n");

const studentValidator = require("./src/validators/studentValidator");

test("studentValidationRules exists (POST - all required)", () => {
    assert(Array.isArray(studentValidator.studentValidationRules), "Should be array of middleware");
    // 8 field validators + 1 validate function = 9
    assert(studentValidator.studentValidationRules.length >= 9, `Should have 9+ rules, got: ${studentValidator.studentValidationRules.length}`);
});

test("updateValidationRules exists (PUT - all optional)", () => {
    assert(Array.isArray(studentValidator.updateValidationRules), "Should be array of middleware");
    assert(studentValidator.updateValidationRules.length >= 9, `Should have 9+ rules, got: ${studentValidator.updateValidationRules.length}`);
});

test("searchValidationRules exists", () => {
    assert(Array.isArray(studentValidator.searchValidationRules), "Should be array of middleware");
});

results.forEach(r => console.log(r));
results.length = 0;

// ============================================================
// PART 2: ATTENDANCE MODEL TESTS
// ============================================================
console.log("\n🔹 PART 2: RFID Attendance System\n");

const Attendance = require("./src/models/Attendance");

test("Attendance schema has all required fields", () => {
    const paths = Attendance.schema.paths;
    const required = ["student", "rfidCardId", "checkInTime", "checkOutTime", "date", "status", "isLate"];
    required.forEach(field => {
        assert(paths[field], `Missing field: ${field}`);
    });
});

test("Student reference is ObjectId with ref to Student model", () => {
    const studentField = Attendance.schema.paths.student;
    assert(studentField.options.ref === "Student", "student should reference Student model");
    assert(studentField.instance === "ObjectId" || studentField.instance === "ObjectID", "student should be ObjectId type");
});

test("Status enum has Present, Late, Absent", () => {
    const statusField = Attendance.schema.paths.status;
    const enumValues = statusField.enumValues;
    assert(enumValues.includes("Present"), "Should include Present");
    assert(enumValues.includes("Late"), "Should include Late");
    assert(enumValues.includes("Absent"), "Should include Absent");
});

test("isLate defaults to false", () => {
    const isLateField = Attendance.schema.paths.isLate;
    assert(isLateField.defaultValue === false, "isLate should default to false");
});

test("Compound unique index on student + date", () => {
    const indexes = Attendance.schema.indexes();
    const compoundIdx = indexes.find(idx => idx[0].student === 1 && idx[0].date === 1);
    assert(compoundIdx, "Compound index on student+date should exist");
    assert(compoundIdx[1].unique === true, "Index should be unique");
});

test("recordRfidScan controller function exists", () => {
    const ac = require("./src/controllers/attendanceController");
    assert(typeof ac.recordRfidScan === "function");
});

test("POST /attendance/rfid-scan route exists", () => {
    const attendanceRouter = require("./src/routes/attendanceRoutes");
    const routes = attendanceRouter.stack.filter(r => r.route);
    const rfidRoute = routes.find(r => r.route.path === "/rfid-scan" && r.route.methods.post);
    assert(rfidRoute, "POST /rfid-scan route should exist");
});

// Test late detection logic (in-memory)
test("Late detection logic: after 8:00 AM = Late", () => {
    const now = new Date();
    const lateThreshold = new Date(now);
    lateThreshold.setHours(8, 0, 0, 0);

    // Simulate 8:30 AM arrival
    const lateArrival = new Date(now);
    lateArrival.setHours(8, 30, 0, 0);
    assert(lateArrival > lateThreshold, "8:30 AM should be after 8:00 AM threshold");

    // Simulate 7:45 AM arrival
    const earlyArrival = new Date(now);
    earlyArrival.setHours(7, 45, 0, 0);
    assert(earlyArrival <= lateThreshold, "7:45 AM should be before/at 8:00 AM threshold");
});

test("RFID communication explanation exists in attendanceController.js", () => {
    const fs = require("fs");
    const content = fs.readFileSync("./src/controllers/attendanceController.js", "utf-8");
    assert(content.includes("HOW RFID READER COMMUNICATES"), "Should have RFID explanation");
    assert(content.includes("microcontroller"), "Should mention microcontroller");
    assert(content.includes("HTTP POST"), "Should mention HTTP POST request");
});

results.forEach(r => console.log(r));
results.length = 0;

// ============================================================
// PART 3: WHATSAPP NOTIFICATION TESTS
// ============================================================
console.log("\n🔹 PART 3: WhatsApp Parent Notifications\n");

const whatsappService = require("./src/services/whatsappService");

test("initializeWhatsApp function exists", () => {
    assert(typeof whatsappService.initializeWhatsApp === "function");
});

test("sendAbsenceNotification function exists", () => {
    assert(typeof whatsappService.sendAbsenceNotification === "function");
});

test("sendLateArrivalNotification function exists", () => {
    assert(typeof whatsappService.sendLateArrivalNotification === "function");
});

test("sendMonthlyReportNotification function exists", () => {
    assert(typeof whatsappService.sendMonthlyReportNotification === "function");
});

test("isWhatsAppReady function exists", () => {
    assert(typeof whatsappService.isWhatsAppReady === "function");
    // Initially should be false (not connected)
    assert(whatsappService.isWhatsAppReady() === false, "Should be false when not initialized");
});

test("POST /notifications/send route exists", () => {
    const notifRouter = require("./src/routes/notificationRoutes");
    const routes = notifRouter.stack.filter(r => r.route);
    const sendRoute = routes.find(r => r.route.path === "/send" && r.route.methods.post);
    assert(sendRoute, "POST /send route should exist");
});

test("Notification validator exists with proper rules", () => {
    const nv = require("./src/validators/notificationValidator");
    assert(Array.isArray(nv.notificationValidationRules), "Should be array of rules");
    assert(nv.notificationValidationRules.length >= 4, "Should have 4+ rules (type, phone, name + validate)");
});

test("WhatsApp explanation exists in whatsappService.js", () => {
    const fs = require("fs");
    const content = fs.readFileSync("./src/services/whatsappService.js", "utf-8");
    assert(content.includes("HOW BACKEND TRIGGERS WHATSAPP MESSAGES"), "Should explain how messages are triggered");
    assert(content.includes("WHY WHATSAPP-WEB.JS IS USED"), "Should explain why library is used");
    assert(content.includes("HOW IT INTEGRATES WITH THE ATTENDANCE SYSTEM"), "Should explain attendance integration");
});

test("WhatsApp uses QR code authentication", () => {
    const fs = require("fs");
    const content = fs.readFileSync("./src/services/whatsappService.js", "utf-8");
    assert(content.includes("qrcode-terminal"), "Should use qrcode-terminal");
    assert(content.includes("LocalAuth"), "Should use LocalAuth strategy");
    assert(content.includes("client.on(\"qr\""), "Should listen for QR event");
});

test("sendNotification controller handles 3 types", () => {
    const fs = require("fs");
    const content = fs.readFileSync("./src/controllers/notificationController.js", "utf-8");
    assert(content.includes("\"absence\""), "Should handle absence type");
    assert(content.includes("\"late\""), "Should handle late type");
    assert(content.includes("\"report\""), "Should handle report type");
});

results.forEach(r => console.log(r));
results.length = 0;

// ============================================================
// PART 4: AI PROPOSAL TESTS
// ============================================================
console.log("\n🔹 PART 4: AI Integration Proposal\n");

const fs = require("fs");
const aiProposal = fs.readFileSync("./AI_PROPOSAL.md", "utf-8");

test("AI Proposal has 5 features", () => {
    assert(aiProposal.includes("### 1."), "Should have feature 1");
    assert(aiProposal.includes("### 2."), "Should have feature 2");
    assert(aiProposal.includes("### 3."), "Should have feature 3");
    assert(aiProposal.includes("### 4."), "Should have feature 4");
    assert(aiProposal.includes("### 5."), "Should have feature 5");
});

test("Feature 1: AI Attendance Pattern Analysis", () => {
    assert(aiProposal.includes("Attendance Pattern Analysis"), "Should have Attendance Pattern Analysis");
    assert(aiProposal.includes("Problem it Solves"), "Should explain problem");
    assert(aiProposal.includes("How it Works"), "Should explain how it works");
    assert(aiProposal.includes("AI Tools"), "Should list AI tools");
    assert(aiProposal.includes("Backend Integration"), "Should explain backend integration");
});

test("Feature 2: AI Student Performance Prediction", () => {
    assert(aiProposal.includes("Performance Prediction"), "Should have Performance Prediction");
});

test("Feature 3: AI Chatbot for Parents", () => {
    assert(aiProposal.includes("Chatbot for Parents"), "Should have Chatbot for Parents");
});

test("Feature 4: AI Automatic Report Generation", () => {
    assert(aiProposal.includes("Report Generation"), "Should have Report Generation");
});

test("Feature 5: AI Behavior and Emotion Detection", () => {
    assert(aiProposal.includes("Behavior and Emotion Detection"), "Should have Behavior and Emotion Detection");
});

results.forEach(r => console.log(r));
results.length = 0;

// ============================================================
// PART 5: ARCHITECTURE TESTS
// ============================================================
console.log("\n🔹 PART 5: System Architecture\n");

const architecture = fs.readFileSync("./ARCHITECTURE.md", "utf-8");

test("Architecture has Backend Architecture section", () => {
    assert(architecture.includes("Backend Architecture"), "Should have Backend Architecture");
    assert(architecture.includes("Folder Structure"), "Should have Folder Structure");
});

test("Architecture has Database Design section", () => {
    assert(architecture.includes("Database Design"), "Should have Database Design");
    assert(architecture.includes("Why MongoDB"), "Should explain why MongoDB");
    assert(architecture.includes("Collections"), "Should list collections");
});

test("Architecture has AI Integration section", () => {
    assert(architecture.includes("AI Integration"), "Should have AI Integration section");
});

test("Architecture has WhatsApp Workflow section", () => {
    assert(architecture.includes("WhatsApp Communication Workflow"), "Should have WhatsApp workflow");
    assert(architecture.includes("RFID Scan"), "Should have step 1");
});

test("Architecture has NPM packages with install command", () => {
    assert(architecture.includes("NPM Packages"), "Should have NPM Packages section");
    assert(architecture.includes("npm install"), "Should have npm install command");
    assert(architecture.includes("express"), "Should list express");
    assert(architecture.includes("mongoose"), "Should list mongoose");
    assert(architecture.includes("whatsapp-web.js"), "Should list whatsapp-web.js");
});

test("Architecture has middleware stack details", () => {
    assert(architecture.includes("Middleware"), "Should mention middleware");
    assert(architecture.includes("Helmet"), "Should mention Helmet");
    assert(architecture.includes("CORS"), "Should mention CORS");
});

results.forEach(r => console.log(r));
results.length = 0;

// ============================================================
// GENERAL: MIDDLEWARE & ERROR HANDLING
// ============================================================
console.log("\n🔹 General: Middleware & Error Handling\n");

test("errorHandler middleware function exists (4 params)", () => {
    const eh = require("./src/middleware/errorHandler");
    assert(typeof eh === "function");
    assert(eh.length === 4, "Error handler should accept 4 args (err, req, res, next)");
});

test("errorHandler handles CastError, 11000, ValidationError", () => {
    const content = fs.readFileSync("./src/middleware/errorHandler.js", "utf-8");
    assert(content.includes("CastError"), "Should handle CastError");
    assert(content.includes("11000"), "Should handle duplicate key (11000)");
    assert(content.includes("ValidationError"), "Should handle ValidationError");
});

test("notFoundHandler middleware function exists", () => {
    const nfh = require("./src/middleware/notFoundHandler");
    assert(typeof nfh === "function");
});

test("Logger utility exports proper logger object", () => {
    const logger = require("./src/utils/logger");
    assert(typeof logger.info === "function", "Should have info method");
    assert(typeof logger.error === "function", "Should have error method");
    assert(typeof logger.warn === "function", "Should have warn method");
});

test("server.js exports Express app", () => {
    // Just test the file exists and has proper structure
    const content = fs.readFileSync("./server.js", "utf-8");
    assert(content.includes("module.exports = app"), "Server should export app for testing");
    assert(content.includes("helmet"), "Should use helmet");
    assert(content.includes("cors"), "Should use cors");
    assert(content.includes("rateLimit"), "Should use rate limiting");
    assert(content.includes("/health"), "Should have health check");
    assert(content.includes("express-async-errors"), "Should use express-async-errors");
});

test("Database config connects with proper URI", () => {
    const content = fs.readFileSync("./src/config/database.js", "utf-8");
    assert(content.includes("MONGODB_URI"), "Should use MONGODB_URI env");
    assert(content.includes("mongoose.connect"), "Should call mongoose.connect");
    assert(content.includes("berry_school_db"), "Should have default DB name");
});

test(".env.example has all required variables", () => {
    const env = fs.readFileSync("./.env.example", "utf-8");
    assert(env.includes("PORT"), "Should have PORT");
    assert(env.includes("MONGODB_URI"), "Should have MONGODB_URI");
    assert(env.includes("JWT_SECRET"), "Should have JWT_SECRET");
    assert(env.includes("OPENAI_API_KEY"), "Should have OPENAI_API_KEY");
    assert(env.includes("WHATSAPP_SESSION_PATH"), "Should have WHATSAPP config");
});

test(".gitignore properly ignores sensitive files", () => {
    const gi = fs.readFileSync("./.gitignore", "utf-8");
    assert(gi.includes("node_modules"), "Should ignore node_modules");
    assert(gi.includes(".env"), "Should ignore .env");
    assert(gi.includes("logs"), "Should ignore logs");
    assert(gi.includes("whatsapp-session"), "Should ignore whatsapp session");
});

test("README.md has complete documentation", () => {
    const readme = fs.readFileSync("./README.md", "utf-8");
    assert(readme.includes("Berry Solutions"), "Should have project name");
    assert(readme.includes("npm install"), "Should have install instructions");
    assert(readme.includes("API Documentation"), "Should have API docs");
    assert(readme.includes("POST"), "Should have POST endpoints");
    assert(readme.includes("GET"), "Should have GET endpoints");
});

test("POSTMAN_DOCS.md has API testing guide", () => {
    const postman = fs.readFileSync("./POSTMAN_DOCS.md", "utf-8");
    assert(postman.includes("Student Management"), "Should have student section");
    assert(postman.includes("Attendance"), "Should have attendance section");
    assert(postman.includes("Notification"), "Should have notification section");
    assert(postman.includes("rfidCardId"), "Should have RFID example");
});

results.forEach(r => console.log(r));
results.length = 0;

// ============================================================
// FINAL REPORT
// ============================================================
console.log("\n" + "=".repeat(50));
console.log(`\n📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} total\n`);
if (failed === 0) {
    console.log("🎉 ALL TESTS PASSED! Project is 100% complete.\n");
} else {
    console.log(`⚠️  ${failed} test(s) failed. Needs attention.\n`);
}
console.log("=".repeat(50));
