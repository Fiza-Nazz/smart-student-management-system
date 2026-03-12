// ============================================================
// BERRY SOLUTIONS - JEST TEST SUITE
// Part 1: Student Management Backend Tests
// ============================================================

"use strict";

const fs = require("fs");
const Student = require("../src/models/Student");
const studentController = require("../src/controllers/studentController");
const studentRouter = require("../src/routes/studentRoutes");
const studentValidator = require("../src/validators/studentValidator");

// ============================================================
// STUDENT MODEL
// ============================================================
describe("Part 1: Student Management Backend", () => {

  describe("Student Schema", () => {
    it("should have all 10 required fields", () => {
      const paths = Student.schema.paths;
      const required = [
        "studentId", "fullName", "dateOfBirth", "class", "section",
        "parentName", "parentPhoneNumber", "address", "rfidCardId", "admissionDate",
      ];
      required.forEach((field) => {
        expect(paths[field]).toBeDefined();
      });
    });

    it("should auto-generate Student ID with STU- prefix", () => {
      const defaultFn = Student.schema.paths.studentId.defaultValue;
      expect(typeof defaultFn).toBe("function");
      const id = defaultFn();
      expect(id.startsWith("STU-")).toBe(true);
      expect(id.length).toBe(12);
    });

    it("should have rfidCardId as unique and indexed", () => {
      const rfid = Student.schema.paths.rfidCardId;
      expect(rfid.options.unique).toBe(true);
      expect(rfid.options.index).toBe(true);
    });

    it("should require fullName", () => {
      const field = Student.schema.paths.fullName;
      expect(field.isRequired).toBeTruthy();
    });

    it("should have timestamps enabled (createdAt, updatedAt)", () => {
      expect(Student.schema.options.timestamps).toBe(true);
    });

    it("should have text search index", () => {
      const indexes = Student.schema.indexes();
      const textIndex = indexes.find((idx) => {
        const fields = idx[0];
        return fields.fullName === "text" || fields._fts === "text";
      });
      expect(textIndex).toBeDefined();
    });
  });

  // ============================================================
  // STUDENT CONTROLLER
  // ============================================================
  describe("Student Controller Functions", () => {
    it("should export addStudent function", () => {
      expect(typeof studentController.addStudent).toBe("function");
    });

    it("should export updateStudent function", () => {
      expect(typeof studentController.updateStudent).toBe("function");
    });

    it("should export deleteStudent function", () => {
      expect(typeof studentController.deleteStudent).toBe("function");
    });

    it("should export getStudent function", () => {
      expect(typeof studentController.getStudent).toBe("function");
    });

    it("should export searchStudents function", () => {
      expect(typeof studentController.searchStudents).toBe("function");
    });
  });

  // ============================================================
  // STUDENT ROUTES
  // ============================================================
  describe("Student Routes", () => {
    const routes = studentRouter.stack.filter((r) => r.route);

    it("should have POST / route", () => {
      const postRoute = routes.find((r) => r.route.path === "/" && r.route.methods.post);
      expect(postRoute).toBeDefined();
    });

    it("should have GET /search route", () => {
      const searchRoute = routes.find((r) => r.route.path === "/search" && r.route.methods.get);
      expect(searchRoute).toBeDefined();
    });

    it("should have GET /:id route", () => {
      const getRoute = routes.find((r) => r.route.path === "/:id" && r.route.methods.get);
      expect(getRoute).toBeDefined();
    });

    it("should have PUT /:id route", () => {
      const putRoute = routes.find((r) => r.route.path === "/:id" && r.route.methods.put);
      expect(putRoute).toBeDefined();
    });

    it("should have DELETE /:id route", () => {
      const deleteRoute = routes.find((r) => r.route.path === "/:id" && r.route.methods.delete);
      expect(deleteRoute).toBeDefined();
    });
  });

  // ============================================================
  // STUDENT VALIDATORS
  // ============================================================
  describe("Student Validators", () => {
    it("should have studentValidationRules (POST - all required) with 9+ rules", () => {
      expect(Array.isArray(studentValidator.studentValidationRules)).toBe(true);
      expect(studentValidator.studentValidationRules.length).toBeGreaterThanOrEqual(9);
    });

    it("should have updateValidationRules (PUT - all optional) with 9+ rules", () => {
      expect(Array.isArray(studentValidator.updateValidationRules)).toBe(true);
      expect(studentValidator.updateValidationRules.length).toBeGreaterThanOrEqual(9);
    });

    it("should have searchValidationRules", () => {
      expect(Array.isArray(studentValidator.searchValidationRules)).toBe(true);
    });
  });
});
