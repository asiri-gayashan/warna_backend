import {
  getAllStudentsService,
  getStudentByEmailService,
  getStudentByIdService,
  updateStudentService,
  removeStudentService,
} from "./student.service.js";

import {
  validateStudentId,
  validateEmail,
} from "./student.validation.js";

export const getAllStudents = async (req, res) => {
  try {
    const students = await getAllStudentsService();

    return res.status(200).json({
      status: true,
      message: "Students retrieved successfully",
      count: students.length,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Error fetching students",
    });
  }
};

export const getStudentByEmail = async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const validation = validateEmail(email);

    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: validation.error,
      });
    }

    const student = await getStudentByEmailService(email);

    return res.status(200).json({
      status: true,
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({
        status: false,
        message: "Student not found",
      });
    }

    return res.status(500).json({
      status: false,
      message: error.message || "Error fetching student by email",
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateStudentId(id);

    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: validation.error,
      });
    }

    const student = await getStudentByIdService(id);

    return res.status(200).json({
      status: true,
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({
        status: false,
        message: "Student not found",
      });
    }

    return res.status(500).json({
      status: false,
      message: error.message || "Error fetching student",
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateStudentId(id);

    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: validation.error,
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: false,
        message: "At least one field must be provided for update",
      });
    }

    const updatedStudent = await updateStudentService(id, req.body);

    return res.status(200).json({
      status: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({
        status: false,
        message: "Student not found",
      });
    }

    if (error.message === "No valid fields to update") {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      status: false,
      message: error.message || "Error updating student",
    });
  }
};

export const removeStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateStudentId(id);

    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: validation.error,
      });
    }

    const deletedStudent = await removeStudentService(id);

    return res.status(200).json({
      status: true,
      message: "Student removed successfully",
      data: deletedStudent,
    });
  } catch (error) {
    if (error.message === "Student not found") {
      return res.status(404).json({
        status: false,
        message: "Student not found",
      });
    }

    if (error.message.includes("related records exist")) {
      return res.status(409).json({
        status: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      status: false,
      message: error.message || "Error removing student",
    });
  }
};

