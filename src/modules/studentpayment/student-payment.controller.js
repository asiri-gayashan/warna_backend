import {
    getPaymentsByClassAndMonthService,
    insertStudentPaymentService,
    updateStudentPaymentStatusService,
  } from "./student-payment.service.js";
  
  import {
    validatePaymentId,
    validateClassAndMonth,
    validateInsertPaymentsPayload,
    validateUpdatePaymentStatus,
  } from "./student-payment.validation.js";
  
  // GET /api/student-payments/:classId?month=5&year=2026
  export const getPaymentsByClassAndMonth = async (req, res) => {
    try {
      const { classId } = req.params;
      const { month, year } = req.query;
  
      const validation = validateClassAndMonth(classId, month, year);
      if (!validation.isValid) {
        return res.status(400).json({
          status: false,
          message: validation.error,
        });
      }
  
      const rows = await getPaymentsByClassAndMonthService(
        classId,
        validation.month,
        validation.year
      );
  
      return res.status(200).json({
        status: true,
        message: "Payments retrieved successfully",
        count: rows.length,
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || "Error fetching payments",
      });
    }
  };
  
  // POST /api/student-payments
  export const insertStudentPayments = async (req, res) => {
    try {
      const validation = validateInsertPaymentsPayload(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          status: false,
          message: "Validation failed",
          errors: validation.errors,
        });
      }
  
      const created = await insertStudentPaymentService(req.body);
  
      return res.status(201).json({
        status: true,
        message: "Payments inserted successfully",
        count: created.length,
        data: created,
      });
    } catch (error) {
      // Duplicate payment for same month
      if (error.message.includes("Payment already exists")) {
        return res.status(409).json({
          status: false,
          message: error.message,
        });
      }
  
      return res.status(500).json({
        status: false,
        message: error.message || "Error inserting payments",
      });
    }
  };
  
  // PATCH /api/student-payments/:id
  export const updateStudentPaymentStatus = async (req, res) => {
    try {
      const { id } = req.params;
  
      const idValidation = validatePaymentId(id);
      if (!idValidation.isValid) {
        return res.status(400).json({
          status: false,
          message: idValidation.error,
        });
      }
  
      const statusValidation = validateUpdatePaymentStatus(req.body);
      if (!statusValidation.isValid) {
        return res.status(400).json({
          status: false,
          message: statusValidation.error,
        });
      }
  
      const updated = await updateStudentPaymentStatusService(
        id,
        statusValidation.normalizedStatus
      );
  
      return res.status(200).json({
        status: true,
        message: "Payment status updated successfully",
        data: updated,
      });
    } catch (error) {
      if (error.message === "Payment record not found") {
        return res.status(404).json({
          status: false,
          message: "Payment record not found",
        });
      }
  
      return res.status(500).json({
        status: false,
        message: error.message || "Error updating payment",
      });
    }
  };