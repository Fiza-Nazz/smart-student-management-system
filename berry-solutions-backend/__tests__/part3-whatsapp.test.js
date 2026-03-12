// ============================================================
// BERRY SOLUTIONS - JEST TEST SUITE
// Part 3: WhatsApp Parent Notifications Tests
// ============================================================

"use strict";

const fs = require("fs");
const whatsappService = require("../src/services/whatsappService");
const notifRouter = require("../src/routes/notificationRoutes");
const notifValidator = require("../src/validators/notificationValidator");

describe("Part 3: WhatsApp Parent Notifications", () => {

  // ============================================================
  // WHATSAPP SERVICE FUNCTIONS
  // ============================================================
  describe("WhatsApp Service", () => {
    it("should export initializeWhatsApp function", () => {
      expect(typeof whatsappService.initializeWhatsApp).toBe("function");
    });

    it("should export sendAbsenceNotification function", () => {
      expect(typeof whatsappService.sendAbsenceNotification).toBe("function");
    });

    it("should export sendLateArrivalNotification function", () => {
      expect(typeof whatsappService.sendLateArrivalNotification).toBe("function");
    });

    it("should export sendMonthlyReportNotification function", () => {
      expect(typeof whatsappService.sendMonthlyReportNotification).toBe("function");
    });

    it("should export isWhatsAppReady function (initially false)", () => {
      expect(typeof whatsappService.isWhatsAppReady).toBe("function");
      expect(whatsappService.isWhatsAppReady()).toBe(false);
    });
  });

  // ============================================================
  // NOTIFICATION ROUTES & VALIDATOR
  // ============================================================
  describe("Notification Routes & Validators", () => {
    it("should have POST /send route", () => {
      const routes = notifRouter.stack.filter((r) => r.route);
      const sendRoute = routes.find((r) => r.route.path === "/send" && r.route.methods.post);
      expect(sendRoute).toBeDefined();
    });

    it("should have notification validator with 4+ rules", () => {
      expect(Array.isArray(notifValidator.notificationValidationRules)).toBe(true);
      expect(notifValidator.notificationValidationRules.length).toBeGreaterThanOrEqual(4);
    });
  });

  // ============================================================
  // WHATSAPP EXPLANATIONS
  // ============================================================
  describe("WhatsApp Explanations in Code", () => {
    const content = fs.readFileSync("./src/services/whatsappService.js", "utf-8");

    it("should explain how backend triggers WhatsApp messages", () => {
      expect(content).toContain("HOW BACKEND TRIGGERS WHATSAPP MESSAGES");
    });

    it("should explain why whatsapp-web.js is used", () => {
      expect(content).toContain("WHY WHATSAPP-WEB.JS IS USED");
    });

    it("should explain how it integrates with attendance system", () => {
      expect(content).toContain("HOW IT INTEGRATES WITH THE ATTENDANCE SYSTEM");
    });

    it("should use QR code authentication with LocalAuth", () => {
      expect(content).toContain("qrcode-terminal");
      expect(content).toContain("LocalAuth");
      expect(content).toContain("client.on(\"qr\"");
    });
  });

  // ============================================================
  // NOTIFICATION CONTROLLER
  // ============================================================
  describe("Notification Controller", () => {
    it("should handle all 3 notification types (absence, late, report)", () => {
      const content = fs.readFileSync("./src/controllers/notificationController.js", "utf-8");
      expect(content).toContain("\"absence\"");
      expect(content).toContain("\"late\"");
      expect(content).toContain("\"report\"");
    });
  });
});
