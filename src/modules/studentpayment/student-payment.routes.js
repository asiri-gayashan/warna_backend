import express from "express";
import {
  getPaymentsByClassAndMonth,
  insertStudentPayments,
  updateStudentPaymentStatus,
} from "./student-payment.controller.js";

const router = express.Router();

router.get("/:classId", getPaymentsByClassAndMonth);
router.post("/", insertStudentPayments);
router.patch("/:id", updateStudentPaymentStatus);

export default router;