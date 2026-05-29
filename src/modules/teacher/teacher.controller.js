import {
  getAllTeachersService,
  getTeacherByEmailService,
  getTeacherByIdService,
  updateTeacherService,
  removeTeacherService,
} from "./teacher.service.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validateTeacherId = (teacherId) => {
  if (!teacherId || typeof teacherId !== "string") {
    return {
      isValid: false,
      error: "Teacher id is required and must be a string",
    };
  }

  if (!UUID_REGEX.test(teacherId)) {
    return {
      isValid: false,
      error: "Teacher id must be a valid UUID",
    };
  }

  return { isValid: true };
};

const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return {
      isValid: false,
      error: "Email is required and must be a string",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Email must be a valid email address",
    };
  }

  return { isValid: true };
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await getAllTeachersService();

    res.status(200).json({
      status: true,
      message: "Teachers retrieved successfully",
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Error fetching teachers",
    });
  }
};

export const getTeacherByEmail = async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const validation = validateEmail(email);

    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: validation.error,
      });
    }

    const teacher = await getTeacherByEmailService(email);

    res.status(200).json({
      status: true,
      message: "Teacher retrieved successfully",
      data: teacher,
    });
  } catch (error) {
    if (error.message === "Teacher not found") {
      return res.status(404).json({
        status: false,
        message: "Teacher not found",
      });
    }

    res.status(500).json({
      status: false,
      message: error.message || "Error fetching teacher by email",
    });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateTeacherId(id);

    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: validation.error,
      });
    }

    const teacher = await getTeacherByIdService(id);

    res.status(200).json({
      status: true,
      message: "Teacher retrieved successfully",
      data: teacher,
    });
  } catch (error) {
    if (error.message === "Teacher not found") {
      return res.status(404).json({
        status: false,
        message: "Teacher not found",
      });
    }

    res.status(500).json({
      status: false,
      message: error.message || "Error fetching teacher",
    });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateTeacherId(id);

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

    const updatedTeacher = await updateTeacherService(id, req.body);

    res.status(200).json({
      status: true,
      message: "Teacher updated successfully",
      data: updatedTeacher,
    });
  } catch (error) {
    if (error.message === "Teacher not found") {
      return res.status(404).json({
        status: false,
        message: "Teacher not found",
      });
    }

    res.status(500).json({
      status: false,
      message: error.message || "Error updating teacher",
    });
  }
};

export const removeTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const validation = validateTeacherId(id);

    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: validation.error,
      });
    }

    const deletedTeacher = await removeTeacherService(id);

    res.status(200).json({
      status: true,
      message: "Teacher removed successfully",
      data: deletedTeacher,
    });
  } catch (error) {
    if (error.message === "Teacher not found") {
      return res.status(404).json({
        status: false,
        message: "Teacher not found",
      });
    }

    if (error.message.includes("related records exist")) {
      return res.status(409).json({
        status: false,
        message: error.message,
      });
    }

    res.status(500).json({
      status: false,
      message: error.message || "Error removing teacher",
    });
  }
};
