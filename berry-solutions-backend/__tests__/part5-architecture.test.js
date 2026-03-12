// ============================================================
// BERRY SOLUTIONS - JEST TEST SUITE
// Part 5: System Architecture Tests
// ============================================================

"use strict";

const fs = require("fs");
const architecture = fs.readFileSync("./ARCHITECTURE.md", "utf-8");

describe("Part 5: System Architecture", () => {

  it("should have Backend Architecture section with folder structure", () => {
    expect(architecture).toContain("Backend Architecture");
    expect(architecture).toContain("Folder Structure");
  });

  it("should have Database Design section explaining why MongoDB", () => {
    expect(architecture).toContain("Database Design");
    expect(architecture).toContain("Why MongoDB");
    expect(architecture).toContain("Collections");
  });

  it("should have AI Integration section", () => {
    expect(architecture).toContain("AI Integration");
  });

  it("should have WhatsApp Communication Workflow with RFID flow", () => {
    expect(architecture).toContain("WhatsApp Communication Workflow");
    expect(architecture).toContain("RFID Scan");
  });

  it("should have NPM packages with install commands", () => {
    expect(architecture).toContain("NPM Packages");
    expect(architecture).toContain("npm install");
    expect(architecture).toContain("express");
    expect(architecture).toContain("mongoose");
    expect(architecture).toContain("whatsapp-web.js");
  });

  it("should have middleware stack details (Helmet, CORS)", () => {
    expect(architecture).toContain("Middleware");
    expect(architecture).toContain("Helmet");
    expect(architecture).toContain("CORS");
  });
});
