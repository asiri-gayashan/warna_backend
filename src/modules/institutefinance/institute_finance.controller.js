import {
  getFinanceSummaryService,
  getClassesFinanceService,
  getTeachersFinanceService,
} from "./institute_finance.service.js";

export const getFinanceSummary = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "month and year query params are required",
      });
    }

    const data = await getFinanceSummaryService(
      instituteId,
      parseInt(month),
      parseInt(year)
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getClassesFinance = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "month and year query params are required",
      });
    }

    const data = await getClassesFinanceService(
      instituteId,
      parseInt(month),
      parseInt(year)
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeachersFinance = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "month and year query params are required",
      });
    }

    const data = await getTeachersFinanceService(
      instituteId,
      parseInt(month),
      parseInt(year)
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};