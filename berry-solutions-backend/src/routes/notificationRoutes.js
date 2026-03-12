// ============================================================
// NOTIFICATION ROUTES
// ============================================================

const express = require("express");
const router = express.Router();
const { sendNotification } = require("../controllers/notificationController");
const { notificationValidationRules } = require("../validators/notificationValidator");

router.post("/send", notificationValidationRules, sendNotification);

module.exports = router;
