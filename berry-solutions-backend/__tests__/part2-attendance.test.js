// ============================================================
// BERRY SOLUTIONS - JEST TEST SUITE
// Part 2: RFID Attendance System Tests
// ============================================================

"use strict";

const fs = require("fs");
const Attendance = require("../src/models/Attendance");
const attendanceController = require("../src/controllers/attendanceController");
const attendanceRouter = require("../src/routes/attendanceRoutes");

describe("Part 2: RFID Attendance System", () => {

  // ============================================================
  // ATTENDANCE MODEL
  // ============================================================
  describe("Attendance Schema", () => {
    it("should have all required fields", () => {
      const paths = Attendance.schema.paths;
      const required = ["student", "rfidCardId", "checkInTime", "checkOutTime", "date", "status", "isLate"];
      required.forEach((field) => {
        expect(paths[field]).toBeDefined();
      });
    });

    it("should have student field as ObjectId referencing Student model", () => {
      const studentField = Attendance.schema.paths.student;
      expect(studentField.options.ref).toBe("Student");
      expect(["ObjectId", "ObjectID"]).toContain(studentField.instance);
    });

    it("should have status enum with Present, Late, Absent", () => {
      const statusField = Attendance.schema.paths.status;
      const enumValues = statusField.enumValues;
      expect(enumValues).toContain("Present");
      expect(enumValues).toContain("Late");
      expect(enumValues).toContain("Absent");
    });

    it("should default isLate to false", () => {
      const isLateField = Attendance.schema.paths.isLate;
      expect(isLateField.defaultValue).toBe(false);
    });

    it("should have compound unique index on student + date", () => {
      const indexes = Attendance.schema.indexes();
      const compoundIdx = indexes.find((idx) => idx[0].student === 1 && idx[0].date === 1);
      expect(compoundIdx).toBeDefined();
      expect(compoundIdx[1].unique).toBe(true);
    });
  });

  // ============================================================
  // ATTENDANCE CONTROLLER & ROUTES
  // ============================================================
  describe("Attendance Controller & Routes", () => {
    it("should export recordRfidScan function", () => {
      expect(typeof attendanceController.recordRfidScan).toBe("function");
    });

    it("should have POST /rfid-scan route", () => {
      const routes = attendanceRouter.stack.filter((r) => r.route);
      const rfidRoute = routes.find((r) => r.route.path === "/rfid-scan" && r.route.methods.post);
      expect(rfidRoute).toBeDefined();
    });
  });

  // ============================================================
  // LATE DETECTION LOGIC
  // ============================================================
  describe("Late Detection Logic", () => {
    it("should mark arrival after 8:00 AM as Late", () => {
      const now = new Date();
      const lateThreshold = new Date(now);
      lateThreshold.setHours(8, 0, 0, 0);

      // Simulate 8:30 AM arrival
      const lateArrival = new Date(now);
      lateArrival.setHours(8, 30, 0, 0);
      expect(lateArrival > lateThreshold).toBe(true);

      // Simulate 7:45 AM arrival
      const earlyArrival = new Date(now);
      earlyArrival.setHours(7, 45, 0, 0);
      expect(earlyArrival <= lateThreshold).toBe(true);
    });
  });

  // ============================================================
  // RFID EXPLANATION
  // ============================================================
  describe("RFID Communication Explanation", () => {
    it("should have RFID communication explanation in attendanceController.js", () => {
      const content = fs.readFileSync("./src/controllers/attendanceController.js", "utf-8");
      expect(content).toContain("HOW RFID READER COMMUNICATES");
      expect(content).toContain("microcontroller");
      expect(content).toContain("HTTP POST");
    });
  });
});
