import {
    getAttendanceByClassAndDateService,
    insertAttendanceService,
    updateAttendanceStatusService,
  } from "./attendance.service.js";
  
  import {
    validateAttendanceId,
    validateClassIdAndDate,
    validateInsertAttendancePayload,
    validateUpdateAttendanceStatus,
  } from "./attendance.validation.js";
  
  export const getAttendanceByClassAndDate = async (req, res) => {
    try {
      const { classId } = req.params;
      const { date } = req.query;
  
      const validation = validateClassIdAndDate(classId, date);
      if (!validation.isValid) {
        return res.status(400).json({
          status: false,
          message: validation.error,
        });
      }
  
      const rows = await getAttendanceByClassAndDateService(classId, date);
  
      return res.status(200).json({
        status: true,
        message: "Attendance retrieved successfully",
        count: rows.length,
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || "Error fetching attendance",
      });
    }
  };
  
  export const insertAttendance = async (req, res) => {
    try {
      const validation = validateInsertAttendancePayload(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          status: false,
          message: "Validation failed",
          errors: validation.errors,
        });
      }
  
      const payload = req.body.map((x) => ({
        class_id: x.class_id,
        student_id: x.student_id,
        marked_user_id: x.marked_user_id,
        status: String(x.status).trim().toUpperCase(),
      }));
  
      const created = await insertAttendanceService(payload);
  
      return res.status(201).json({
        status: true,
        message: "Attendance inserted successfully",
        count: created.length,
        data: created,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || "Error inserting attendance",
      });
    }
  };
  
  export const updateAttendanceStatus = async (req, res) => {
    try {
      const { id } = req.params;
  
      const idValidation = validateAttendanceId(id);
      if (!idValidation.isValid) {
        return res.status(400).json({
          status: false,
          message: idValidation.error,
        });
      }
  
      const statusValidation = validateUpdateAttendanceStatus(req.body);
      if (!statusValidation.isValid) {
        return res.status(400).json({
          status: false,
          message: statusValidation.error,
        });
      }
  
      const updated = await updateAttendanceStatusService(
        id,
        statusValidation.normalizedStatus
      );
  
      return res.status(200).json({
        status: true,
        message: "Attendance status updated successfully",
        data: updated,
      });
    } catch (error) {
      if (error.message === "Attendance record not found") {
        return res.status(404).json({
          status: false,
          message: "Attendance record not found",
        });
      }
  
      return res.status(500).json({
        status: false,
        message: error.message || "Error updating attendance",
      });
    }
  };