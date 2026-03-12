// ============================================================
// STUDENT ROUTES
// ============================================================

const express = require("express");
const router = express.Router();

const {
    addStudent,
    updateStudent,
    deleteStudent,
    getStudent,
    searchStudents,
} = require("../controllers/studentController");

const {
    studentValidationRules,
    updateValidationRules,
    searchValidationRules,
} = require("../validators/studentValidator");

router.post("/", studentValidationRules, addStudent);
router.get("/search", searchValidationRules, searchStudents);

router
    .route("/:id")
    .get(getStudent)
    .put(updateValidationRules, updateStudent)
    .delete(deleteStudent);

module.exports = router;
