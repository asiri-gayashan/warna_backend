import {
  getAllEnrollStudentsService,
  getAllEnrollStudentsByClassIdService,
  insertEnrollStudentsService,
  updateEnrollmentStatusService,
} from "./enrollstudent.service.js";

import {
  validateEnrollmentId,
  validateClassId,
  validateEnrollStudentsPayload,
  validateUpdateEnrollmentStatus,
} from "./enrollstudent.validation.js";

export const getAllEnrollStudents = async (req, res) => {
  try {
    const rows = await getAllEnrollStudentsService();

    return res.status(200).json({
      status: true,
      message: "Enrollments retrieved successfully",
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Error fetching enrollments",
    });
  }
};

export const getAllEnrollStudentsByClassId = async (req, res) => {
  try {
    const { classId } = req.params;
    const validation = validateClassId(classId);

    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: validation.error,
      });
    }

    const rows = await getAllEnrollStudentsByClassIdService(classId);

    return res.status(200).json({
      status: true,
      message: "Enrollments retrieved successfully",
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Error fetching enrollments",
    });
  }
};

export const insertEnrollStudents = async (req, res) => {
  try {
    const validation = validateEnrollStudentsPayload(req.body);

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
      status:
        x.status === undefined || x.status === null
          ? null
          : String(x.status).trim().toUpperCase(),
    }));

    const created = await insertEnrollStudentsService(payload);

    return res.status(201).json({
      status: true,
      message: "Enrollments inserted successfully",
      count: created.length,
      data: created,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Error inserting enrollments",
    });
  }
};

export const updateEnrollmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const idValidation = validateEnrollmentId(id);

    if (!idValidation.isValid) {
      return res.status(400).json({
        status: false,
        message: idValidation.error,
      });
    }

    const statusValidation = validateUpdateEnrollmentStatus(req.body);
    if (!statusValidation.isValid) {
      return res.status(400).json({
        status: false,
        message: statusValidation.error,
      });
    }

    const updated = await updateEnrollmentStatusService(
      id,
      statusValidation.normalizedStatus
    );

    return res.status(200).json({
      status: true,
      message: "Enrollment status updated successfully",
      data: updated,
    });
  } catch (error) {
    if (error.message === "Enrollment not found") {
      return res.status(404).json({
        status: false,
        message: "Enrollment not found",
      });
    }

    return res.status(500).json({
      status: false,
      message: error.message || "Error updating enrollment",
    });
  }
};

