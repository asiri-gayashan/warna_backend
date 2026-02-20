import {
  createClassService,
  getAllClassesService,
  getClassByIdService,
  updateClassService,
  deleteClassService,
} from "./classes.service.js";

import {
  validateCreateClass,
  validateUpdateClass,
  validateClassId,
} from "./classes.validation.js";

// Create a new class
export const createClass = async (req, res) => {
  try {
    // Validate request body
    const validation = validateCreateClass(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    // Call service to create class
    const newClass = await createClassService(req.body);

    res.status(201).json({
      status: true,
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Error creating class",
    });
  }
};

// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    // Extract optional filters from query parameters
    const filters = {
      teacherId: req.query.teacherId,
      grade: req.query.grade,
      subject: req.query.subject,
    };

    // Remove undefined filters
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key]
    );

    // Call service to get all classes
    const classes = await getAllClassesService(filters);

    res.status(200).json({
      status: true,
      message: "Classes retrieved successfully",
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Error fetching classes",
    });
  }
};

// Get class by ID
export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate class ID
    const validation = validateClassId(id);

    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: validation.error,
      });
    }

    // Call service to get class by ID
    const classData = await getClassByIdService(id);

    res.status(200).json({
      status: true,
      message: "Class retrieved successfully",
      data: classData,
    });
  } catch (error) {
    if (error.message === "Class not found") {
      return res.status(404).json({
        status: false,
        message: "Class not found",
      });
    }

    res.status(500).json({
      status: false,
      message: error.message || "Error fetching class",
    });
  }
};

// Update class
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate class ID
    const idValidation = validateClassId(id);

    if (!idValidation.isValid) {
      return res.status(400).json({
        status: false,
        message: idValidation.error,
      });
    }

    // Validate request body
    const validation = validateUpdateClass(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    // Call service to update class
    const updatedClass = await updateClassService(id, req.body);

    res.status(200).json({
      status: true,
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (error) {
    if (error.message === "Class not found") {
      return res.status(404).json({
        status: false,
        message: "Class not found",
      });
    }

    res.status(500).json({
      status: false,
      message: error.message || "Error updating class",
    });
  }
};

// Delete class
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate class ID
    const validation = validateClassId(id);

    if (!validation.isValid) {
      return res.status(400).json({
        status: false,
        message: validation.error,
      });
    }

    // Call service to delete class
    const deletedClass = await deleteClassService(id);

    res.status(200).json({
      status: true,
      message: "Class deleted successfully",
      data: deletedClass,
    });
  } catch (error) {
    if (error.message === "Class not found") {
      return res.status(404).json({
        status: false,
        message: "Class not found",
      });
    }

    res.status(500).json({
      status: false,
      message: error.message || "Error deleting class",
    });
  }
};
