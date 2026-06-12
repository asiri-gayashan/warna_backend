import { Router } from "express";
import {
  getFinanceSummary,
  getClassesFinance,
  getTeachersFinance,
} from "./institute_finance.controller.js";

const router = Router();

// GET /institute/finance/summary/:instituteId?month=6&year=2026
router.get("/finance/summary/:instituteId", getFinanceSummary);

// GET /institute/finance/classes/:instituteId?month=6&year=2026
router.get("/finance/classes/:instituteId", getClassesFinance);
 
// GET /institute/finance/teachers/:instituteId?month=6&year=2026
router.get("/finance/teachers/:instituteId", getTeachersFinance);

export default router;