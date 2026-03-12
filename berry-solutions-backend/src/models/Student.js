// ============================================================
// STUDENT MODEL
// ============================================================

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const studentSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            default: () => `STU-${uuidv4().substring(0, 8).toUpperCase()}`,
            unique: true,
            index: true,
        },
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },
        dateOfBirth: {
            type: Date,
            required: [true, "Date of birth is required"],
        },
        class: {
            type: String,
            required: [true, "Class is required"],
        },
        section: {
            type: String,
            required: [true, "Section is required"],
        },
        parentName: {
            type: String,
            required: [true, "Parent name is required"],
            trim: true,
        },
        parentPhoneNumber: {
            type: String,
            required: [true, "Parent phone number is required"],
            trim: true,
        },
        address: {
            type: String,
            required: [true, "Address is required"],
        },
        rfidCardId: {
            type: String,
            required: [true, "RFID Card ID is required"],
            unique: true,
            index: true,
        },
        admissionDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Search index for text-based searching
studentSchema.index({ fullName: "text", studentId: "text", rfidCardId: "text" });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
