import {
  getInstituteStatsService,
} from "./institute_stats.service.js";
import {
  getClassPerformanceService,
} from "./institute_performance.service.js";
import {
  getUpcomingClassesService,
} from "./institute_upcoming.service.js";
import {
  getClassReportService,
  getStudentReportService,
  getTutorReportService,
} from "./institute_report.service.js";

// ── Stats ─────────────────────────────────────────────────────
export const getInstituteStats = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const data = await getInstituteStatsService(instituteId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── Performance ───────────────────────────────────────────────
export const getClassPerformance = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const data = await getClassPerformanceService(instituteId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── Upcoming Classes ──────────────────────────────────────────
export const getUpcomingClasses = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const data = await getUpcomingClassesService(instituteId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── Reports ───────────────────────────────────────────────────
export const getClassReport = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const data = await getClassReportService(instituteId, req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentReport = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const data = await getStudentReportService(instituteId, req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTutorReport = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const data = await getTutorReportService(instituteId, req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};