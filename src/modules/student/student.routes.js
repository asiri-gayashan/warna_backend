import express from "express";
import {
  getAllStudents,
  getStudentByEmail,
  getStudentById,
  updateStudent,
  removeStudent,
  getStudentsByInstituteController,
  getStudentsByTutorController,
} from "./student.controller.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/email/:email", getStudentByEmail);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", removeStudent);
router.get("/institute/:instituteId", getStudentsByInstituteController);
router.get("/tutor/:tutorId", getStudentsByTutorController);

export default router;

