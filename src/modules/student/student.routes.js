import express from "express";
import {
  getAllStudents,
  getStudentByEmail,
  getStudentById,
  updateStudent,
  removeStudent,
} from "./student.controller.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/email/:email", getStudentByEmail);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", removeStudent);

export default router;

