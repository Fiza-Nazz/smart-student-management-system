// ============================================================
// ATTENDANCE MODEL
// ============================================================

const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
            index: true,
        },
        rfidCardId: {
            type: String,
            required: true,
            index: true,
        },
        checkInTime: {
            type: Date,
        },
        checkOutTime: {
            type: Date,
        },
        date: {
            type: String, // String format YYYY-MM-DD for easier querying
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["Present", "Late", "Absent"],
            default: "Present",
        },
        isLate: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure a student only has one attendance record per day
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
