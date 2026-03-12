// ============================================================
// NOTIFICATION REQUEST VALIDATORS
// ============================================================

const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({
        success: false,
        errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
    });
};

exports.notificationValidationRules = [
    body("type")
        .notEmpty().withMessage("Notification type is required")
        .isIn(["absence", "late", "report"]).withMessage("Type must be one of: absence, late, report"),
    body("parentPhone")
        .notEmpty().withMessage("Parent phone number is required")
        .isMobilePhone().withMessage("Invalid phone number"),
    body("studentName")
        .notEmpty().withMessage("Student name is required")
        .trim(),
    validate,
];
