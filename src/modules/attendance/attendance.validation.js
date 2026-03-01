// Validation for creating a class
export const validateCreateClass = (data) => {
  const errors = {};

  // Teacher
  if (!data.teacherId || typeof data.teacherId !== "string") {
    errors.teacherId = "teacherId is required and must be a string";
  }

  // Basic Info
  if (!data.name || typeof data.name !== "string") {
    errors.name = "name is required";
  }

  if (!data.subject || typeof data.subject !== "string") {
    errors.subject = "subject is required";
  }

  if (!data.grade || typeof data.grade !== "string") {
    errors.grade = "grade is required";
  }

  // Schedule
  if (!data.day || typeof data.day !== "string") {
    errors.day = "day is required";
  }

  if (!data.time || typeof data.time !== "string") {
    errors.time = "time is required";
  }

  if (!data.duration || typeof data.duration !== "string") {
    errors.duration = "duration is required";
  }

  // Class Details
  if (!data.location || typeof data.location !== "string") {
    errors.location = "location is required";
  }

  if (!data.description || typeof data.description !== "string") {
    errors.description = "description is required";
  }

  // Optional fields
  // if (data.status !== undefined && typeof data.status !== "boolean") {
  //   errors.status = "status must be boolean";
  // }

  // if (data.instituteId !== undefined && data.instituteId !== null && typeof data.instituteId !== "string") {
  //   errors.instituteId = "instituteId must be string or null";
  // }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validation for updating a class
export const validateUpdateClass = (data) => {
  const errors = {};

  // All fields are optional for update
  if (data.grade && typeof data.grade !== "string") {
    errors.grade = "grade must be a string";
  }

  if (data.subject && typeof data.subject !== "string") {
    errors.subject = "subject must be a string";
  }

  if (data.name && typeof data.name !== "string") {
    errors.name = "name must be a string";
  }

  if (data.schedule_day && typeof data.schedule_day !== "string") {
    errors.schedule_day = "schedule_day must be a string";
  }

  if (data.schedule_time && typeof data.schedule_time !== "string") {
    errors.schedule_time = "schedule_time must be a string";
  }

  if (data.end_time && typeof data.end_time !== "string") {
    errors.end_time = "end_time must be a string";
  }

//   if (data.instituteId && typeof data.instituteId !== "string") {
//     errors.instituteId = "instituteId must be a string";
//   }

  // Check that at least one field is provided for update
  if (Object.keys(data).length === 0) {
    errors.general = "At least one field must be provided for update";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


