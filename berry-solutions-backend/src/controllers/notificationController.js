// ============================================================
// NOTIFICATION CONTROLLER
// ============================================================

const whatsappService = require("../services/whatsappService");
const logger = require("../utils/logger");

/**
 * @desc    Manually trigger WhatsApp messages (Absence / Late / Report)
 * @route   POST /api/v1/notifications/send
 */
exports.sendNotification = async (req, res) => {
    const { type, parentPhone, studentName, additionalData } = req.body;

    if (!whatsappService.isWhatsAppReady() && !whatsappService.isSimulationMode()) {
        return res.status(503).json({
            success: false,
            message: "WhatsApp client is not authenticated yet. Please scan QR code in terminal.",
        });
    }

    try {
        switch (type) {
            case "absence":
                await whatsappService.sendAbsenceNotification(parentPhone, studentName);
                break;
            case "late":
                await whatsappService.sendLateArrivalNotification(parentPhone, studentName, additionalData || "8:30 AM");
                break;
            case "report":
                await whatsappService.sendMonthlyReportNotification(parentPhone, studentName, additionalData || "Attendance: 95%, Behavior: Excellent");
                break;
            default:
                return res.status(400).json({ success: false, message: "Invalid notification type" });
        }

        const isSimulated = !whatsappService.isWhatsAppReady() && whatsappService.isSimulationMode();

        res.status(200).json({
            success: true,
            message: `${type} notification ${isSimulated ? "simulated" : "sent"} successfully to ${parentPhone}`,
            simulated: isSimulated,
        });
    } catch (error) {
        logger.error(`Notification Error: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};
