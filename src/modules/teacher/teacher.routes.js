import express from "express";
import {
  getAllTeachers,
  getTeacherByEmail,
  getTeacherById,
  updateTeacher,
  removeTeacher,
} from "./teacher.controller.js";

const router = express.Router();

router.get("/", getAllTeachers);
router.get("/email/:email", getTeacherByEmail);
router.get("/:id", getTeacherById);
router.put("/:id", updateTeacher);
router.delete("/:id", removeTeacher);

export default router;
