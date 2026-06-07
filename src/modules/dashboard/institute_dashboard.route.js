import { Router } from "express";
import {
  getInstituteStats,
  getClassPerformance,
  getUpcomingClasses,
  getClassReport,
  getStudentReport,
  getTutorReport,
} from "./institute_dashboard.controller.js";

const router = Router();
 
// Dashboard data
router.get("/stats/:instituteId",         getInstituteStats);
router.get("/performance/:instituteId",   getClassPerformance);
router.get("/upcoming/:instituteId",      getUpcomingClasses);
   
// Reports (filters passed as query params)
// e.g. /institute/reports/classes/UUID?grade=12&status=ACTIVE&from=2026-01-01
router.get("/reports/classes/:instituteId",  getClassReport);
router.get("/reports/students/:instituteId", getStudentReport); 
router.get("/reports/tutors/:instituteId",   getTutorReport);

export default router;
