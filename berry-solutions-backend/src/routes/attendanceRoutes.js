// ============================================================
// ATTENDANCE ROUTES
// ============================================================

const express = require("express");
const router = express.Router();
const { recordRfidScan } = require("../controllers/attendanceController");

router.post("/rfid-scan", recordRfidScan);

module.exports = router;
