// ============================================================
// WHATSAPP SERVICE
// Using whatsapp-web.js for automated parent notifications
// ============================================================
//
// HOW BACKEND TRIGGERS WHATSAPP MESSAGES:
// ----------------------------------------
// The backend triggers WhatsApp messages in two ways:
// 1. AUTOMATIC: When the attendanceController detects a late arrival
//    (check-in after 8:00 AM), it directly calls
//    sendLateArrivalNotification() from this service to alert parents.
// 2. MANUAL: The admin can hit POST /api/v1/notifications/send with
//    a type (absence/late/report) to trigger messages on demand.
//
// WHY WHATSAPP-WEB.JS IS USED:
// ----------------------------------------
// whatsapp-web.js is a FREE, open-source library that automates
// WhatsApp Web using Puppeteer (headless Chrome). Unlike the official
// WhatsApp Business API (which requires approval and costs money),
// whatsapp-web.js only needs a QR code scan from any WhatsApp account.
// This makes it ideal for school projects and small-scale deployments
// where budget is limited and quick setup is needed.
//
// HOW IT INTEGRATES WITH THE ATTENDANCE SYSTEM:
// ----------------------------------------
// 1. Student taps RFID card → attendanceController records check-in.
// 2. If check-in time > 8:00 AM → isLate = true.
// 3. Controller calls whatsappService.sendLateArrivalNotification()
//    with the parent's phone number and student name.
// 4. This service formats the phone number, composes the message,
//    and sends it via the authenticated WhatsApp Web session.
// 5. For absences, the admin manually triggers notifications via the
//    /notifications/send API endpoint.
//
// ============================================================

"use strict";

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const logger = require("../utils/logger");

let client;
let isReady = false;
const SIMULATION_MODE = process.env.WHATSAPP_SIMULATION !== "false";

/**
 * Initializes the WhatsApp client
 */
const initializeWhatsApp = async () => {
    client = new Client({
        authStrategy: new LocalAuth({
            dataPath: "./whatsapp-session",
        }),
        puppeteer: {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
    });

    // Generate QR code for authentication
    client.on("qr", (qr) => {
        logger.info("WhatsApp: Scan the QR code below to authenticate:");
        qrcode.generate(qr, { small: true });
    });

    // Client is ready
    client.on("ready", () => {
        logger.info("✅ WhatsApp Client is READY");
        isReady = true;
    });

    // Authentication failed
    client.on("auth_failure", (msg) => {
        logger.error("❌ WhatsApp Authentication failed:", msg);
    });

    // Disconnected
    client.on("disconnected", (reason) => {
        logger.warn("WhatsApp Client was disconnected:", reason);
        isReady = false;
        // Re-initialize
        client.initialize();
    });

    await client.initialize();
};

/**
 * Helper to format phone number to WhatsApp format
 * @param {string} phone - User's phone number
 */
const formatPhoneNumber = (phone) => {
    // Simple cleanup: remove non-digits and ensure it has country code
    let cleaned = phone.replace(/\D/g, "");
    // Example: if starts with 0, replace with country code (92 for Pakistan as example)
    if (cleaned.startsWith("0")) {
        cleaned = "92" + cleaned.substring(1);
    }
    // If no country code, prepend one (defaulting to 92 for Pakistan context)
    if (cleaned.length < 11) {
        cleaned = "92" + cleaned;
    }
    return `${cleaned}@c.us`;
};

/**
 * Helper to safely send WhatsApp message and handle detached frame errors
 */
const sendMessageSafe = async (parentPhone, textMessage, typeLabel) => {
    if (!isReady) {
        if (SIMULATION_MODE) {
            logger.info(`[SIMULATION] ${typeLabel} would be sent to ${parentPhone}: ${textMessage}`);
            return { simulated: true, phone: parentPhone, message: textMessage };
        }
        throw new Error("WhatsApp client not ready. Please scan QR code.");
    }

    const chatId = formatPhoneNumber(parentPhone);
    try {
        await client.sendMessage(chatId, textMessage);
        logger.info(`${typeLabel} sent successfully to ${parentPhone}`);
        return { success: true };
    } catch (error) {
        logger.error(`WhatsApp Error while sending ${typeLabel}: ${error.message}`);

        // If Puppeteer frame is detached or browser closed, trigger an auto-recovery
        if (error.message.includes("detached Frame") || error.message.includes("Target closed") || error.message.includes("Session closed")) {
            logger.warn("⚠️ WhatsApp Web session corrupted (Detached Frame). Auto-restarting client...");
            isReady = false; // Prevent further attempts until re-initialized

            // Rebuild the client in the background without blocking the current request
            client.destroy().catch(() => { }).then(() => {
                setTimeout(() => initializeWhatsApp(), 2000);
            });
        }

        // Graceful fallback if simulation is allowed, avoiding 500 errors for the frontend
        if (SIMULATION_MODE) {
            logger.info(`[SIMULATION FALLBACK] Dropping to simulated mode due to error: ${error.message}`);
            return { simulated: true, phone: parentPhone, message: textMessage, fallbackError: error.message };
        }

        throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }
};

/**
 * 1. Send absence notification
 */
const sendAbsenceNotification = async (parentPhone, studentName) => {
    const message = `🔔 *Absence Alert - Berry Solutions School*\n\nDear Parent, your ward *${studentName}* is absent today. Please provide a reason if this was unplanned.`;
    return sendMessageSafe(parentPhone, message, "Absence notification");
};

/**
 * 2. Send late arrival notification
 */
const sendLateArrivalNotification = async (parentPhone, studentName, time) => {
    const message = `⚠️ *Late Arrival Alert - Berry Solutions School*\n\nDear Parent, your ward *${studentName}* arrived late at school today at *${time}*. Regular attendance is vital for academic success.`;
    return sendMessageSafe(parentPhone, message, "Late arrival notification");
};

/**
 * 3. Send monthly report notification
 */
const sendMonthlyReportNotification = async (parentPhone, studentName, report) => {
    const message = `📊 *Monthly Progress Report - Berry Solutions School*\n\nDear Parent, here is the monthly report for *${studentName}*:\n\n${report}\n\nThank you for choosing Berry Solutions.`;
    return sendMessageSafe(parentPhone, message, "Monthly report");
};

module.exports = {
    initializeWhatsApp,
    sendAbsenceNotification,
    sendLateArrivalNotification,
    sendMonthlyReportNotification,
    isWhatsAppReady: () => isReady,
    isSimulationMode: () => SIMULATION_MODE,
};
