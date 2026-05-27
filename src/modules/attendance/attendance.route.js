import express from "express";
import {
  getAttendanceByClassAndDate,
  insertAttendance,
  updateAttendanceStatus,
} from "./attendance.controller.js";

const router = express.Router();

router.get("/:classId", getAttendanceByClassAndDate);
router.post("/", insertAttendance);
router.patch("/:id", updateAttendanceStatus);

export default router;