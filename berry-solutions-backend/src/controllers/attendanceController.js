// ============================================================
// ATTENDANCE CONTROLLER
// ============================================================
//
// HOW RFID READER COMMUNICATES WITH THE BACKEND:
// -----------------------------------------------
// The RFID hardware reader (e.g., RC522 or EM-18) is connected to a
// microcontroller (Arduino/Raspberry Pi) at the school gate. When a
// student taps their RFID card, the microcontroller reads the unique
// Card ID and sends an HTTP POST request to our backend endpoint
// POST /api/v1/attendance/rfid-scan with { "rfidCardId": "CARD_ID" }.
// The backend then looks up the student, records check-in/check-out,
// and triggers WhatsApp notifications if the student is late.
//
// ============================================================

const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const logger = require("../utils/logger");
const { sendLateArrivalNotification } = require("../services/whatsappService");

/**
 * @desc    Record attendance on RFID card scan
 * @route   POST /api/v1/attendance/rfid-scan
 */
exports.recordRfidScan = async (req, res) => {
    const { rfidCardId } = req.body;

    if (!rfidCardId) {
        return res.status(400).json({ success: false, message: "RFID Card ID is required" });
    }

    // 1. Find student by RFID
    const student = await Student.findOne({ rfidCardId });
    if (!student) {
        return res.status(404).json({ success: false, message: "Student not found for this RFID Card" });
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const now = new Date();

    // Define late threshold (8:00 AM)
    const lateThreshold = new Date(now);
    lateThreshold.setHours(8, 0, 0, 0);

    // 2. Check if attendance already exists for today
    let attendance = await Attendance.findOne({ student: student._id, date: today });

    if (!attendance) {
        // 3. FIRST SCAN OF DAY = CHECK-IN
        const isLate = now > lateThreshold;

        attendance = await Attendance.create({
            student: student._id,
            rfidCardId,
            date: today,
            checkInTime: now,
            status: isLate ? "Late" : "Present",
            isLate: isLate,
        });

        logger.info(`Check-in recorded for ${student.fullName} at ${now.toLocaleTimeString()}${isLate ? " (LATE)" : ""}`);

        // If late, trigger WhatsApp notification
        if (isLate) {
            sendLateArrivalNotification(
                student.parentPhoneNumber,
                student.fullName,
                now.toLocaleTimeString()
            ).catch(err => logger.error(`WhatsApp notification failed: ${err.message}`));
        }

        return res.status(200).json({
            success: true,
            message: "Check-in recorded",
            data: attendance,
            type: "check-in",
            isLate,
        });
    } else if (!attendance.checkOutTime) {
        // 4. SECOND SCAN OF DAY = CHECK-OUT
        attendance.checkOutTime = now;
        await attendance.save();

        logger.info(`Check-out recorded for ${student.fullName} at ${now.toLocaleTimeString()}`);

        return res.status(200).json({
            success: true,
            message: "Check-out recorded",
            data: attendance,
            type: "check-out",
        });
    } else {
        // Already checked out
        return res.status(400).json({
            success: false,
            message: "Attendance already completed for today",
            data: attendance,
        });
    }
};
