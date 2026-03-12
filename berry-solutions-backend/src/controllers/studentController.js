// ============================================================
// STUDENT CONTROLLER
// ============================================================

const Student = require("../models/Student");
const logger = require("../utils/logger");

/**
 * @desc    Add new student
 * @route   POST /api/v1/students
 */
exports.addStudent = async (req, res) => {
    const student = await Student.create(req.body);

    logger.info(`Student added: ${student.fullName} (${student.studentId})`);

    res.status(201).json({
        success: true,
        data: student,
    });
};

/**
 * @desc    Update student
 * @route   PUT /api/v1/students/:id
 */
exports.updateStudent = async (req, res) => {
    let student = await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
    }

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: student,
    });
};

/**
 * @desc    Delete student
 * @route   DELETE /api/v1/students/:id
 */
exports.deleteStudent = async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
    }

    await student.deleteOne();

    res.status(200).json({
        success: true,
        message: "Student deleted successfully",
    });
};

/**
 * @desc    Get single student details
 * @route   GET /api/v1/students/:id
 */
exports.getStudent = async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
        success: true,
        data: student,
    });
};

/**
 * @desc    Search students (or get all if query is empty)
 * @route   GET /api/v1/students/search
 */
exports.searchStudents = async (req, res) => {
    const { query } = req.query;

    // If no query provided, return ALL students (used for dashboard count)
    let students;
    if (!query || query.trim() === "") {
        students = await Student.find({});
    } else {
        students = await Student.find({
            $or: [
                { fullName: { $regex: query, $options: "i" } },
                { studentId: { $regex: query, $options: "i" } },
                { rfidCardId: { $regex: query, $options: "i" } },
            ],
        });
    }

    res.status(200).json({
        success: true,
        count: students.length,
        data: students,
    });
};
