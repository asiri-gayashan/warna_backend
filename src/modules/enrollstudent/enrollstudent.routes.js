import express from "express";
import {
  getAllEnrollStudents,
  getAllEnrollStudentsByClassId,
  insertEnrollStudents,
  updateEnrollmentStatus,
} from "./enrollstudent.controller.js";

const router = express.Router();

router.post("/", insertEnrollStudents);

router.get("/", getAllEnrollStudents);

// View enrollments by class id (class_id in class_students)
router.get("/:classId", getAllEnrollStudentsByClassId);

router.put("/:id", updateEnrollmentStatus);

export default router;

