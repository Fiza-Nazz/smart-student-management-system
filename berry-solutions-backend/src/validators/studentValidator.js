// ============================================================
// STUDENT REQUEST VALIDATORS
// ============================================================

const { body, query, validationResult } = require("express-validator");

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

exports.studentValidationRules = [
    body("fullName").notEmpty().withMessage("Full name is required").trim(),
    body("dateOfBirth").isISO8601().withMessage("Valid date of birth (YYYY-MM-DD) is required"),
    body("class").notEmpty().withMessage("Class is required"),
    body("section").notEmpty().withMessage("Section is required"),
    body("parentName").notEmpty().withMessage("Parent name is required"),
    body("parentPhoneNumber").notEmpty().withMessage("Parent phone number is required").isMobilePhone().withMessage("Invalid phone number"),
    body("address").notEmpty().withMessage("Address is required"),
    body("rfidCardId").notEmpty().withMessage("RFID Card ID is required"),
    validate,
];

exports.updateValidationRules = [
    body("fullName").optional().notEmpty().withMessage("Full name cannot be empty").trim(),
    body("dateOfBirth").optional().isISO8601().withMessage("Valid date of birth (YYYY-MM-DD) is required"),
    body("class").optional().notEmpty().withMessage("Class cannot be empty"),
    body("section").optional().notEmpty().withMessage("Section cannot be empty"),
    body("parentName").optional().notEmpty().withMessage("Parent name cannot be empty"),
    body("parentPhoneNumber").optional().notEmpty().withMessage("Parent phone number cannot be empty").isMobilePhone().withMessage("Invalid phone number"),
    body("address").optional().notEmpty().withMessage("Address cannot be empty"),
    body("rfidCardId").optional().notEmpty().withMessage("RFID Card ID cannot be empty"),
    validate,
];

exports.searchValidationRules = [
    // query is optional - if not provided, returns all students (used for dashboard count)
    query("query").optional().isLength({ min: 0 }).withMessage("Invalid query"),
    validate,
];
