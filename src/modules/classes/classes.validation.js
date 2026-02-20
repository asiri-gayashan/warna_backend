// Validation for creating a class
export const validateCreateClass = (data) => {
  const errors = {};

  // Check teacherId
  if (!data.teacherId || typeof data.teacherId !== "string") {
    errors.teacherId = "teacherId is required and must be a string";
  }

  // Check grade
  if (!data.grade || typeof data.grade !== "string") {
    errors.grade = "grade is required and must be a string";
  }

  // Check subject
  if (!data.subject || typeof data.subject !== "string") {
    errors.subject = "subject is required and must be a string";
  }

  // Check name
  if (!data.name || typeof data.name !== "string") {
    errors.name = "name is required and must be a string";
  }

  // Check schedule_day
  if (!data.schedule_day || typeof data.schedule_day !== "string") {
    errors.schedule_day = "schedule_day is required and must be a string";
  }

  // Check schedule_time
  if (!data.schedule_time || typeof data.schedule_time !== "string") {
    errors.schedule_time = "schedule_time is required and must be a string";
  }

  // Check end_time
  if (!data.end_time || typeof data.end_time !== "string") {
    errors.end_time = "end_time is required and must be a string";
  }



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

// Validation for class ID
export const validateClassId = (classId) => {
  if (!classId || typeof classId !== "string") {
    return {
      isValid: false,
      error: "classId is required and must be a string",
    };
  }

  return {
    isValid: true,
  };
};
