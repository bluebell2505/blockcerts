// backend/src/routes/attendance.js
import express from "express";
import { scanAttendance } from "../controllers/attendanceController.js";
import { validateAttendanceScan } from "../utils/validator.js";

const router = express.Router();
router.post("/scan", validateAttendanceScan, scanAttendance);

export default router;