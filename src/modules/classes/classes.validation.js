const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

const isValidUuid = (value) =>
  typeof value === "string" && UUID_REGEX.test(value);

const isValidTime = (value) =>
  typeof value === "string" && TIME_REGEX.test(value);

// Validation for creating a class
export const validateCreateClass = (data) => {
  const errors = {};

  if (!data.name || typeof data.name !== "string") {
    errors.name = "name is required and must be a string";
  }

  if (!isValidUuid(data.subject_id)) {
    errors.subject_id = "subject_id is required and must be a valid UUID";
  }

  if (!isValidUuid(data.tutor_id)) {
    errors.tutor_id = "tutor_id is required and must be a valid UUID";
  }

  if (
    data.institute_id !== undefined &&
    data.institute_id !== null &&
    !isValidUuid(data.institute_id)
  ) {
    errors.institute_id = "institute_id must be a valid UUID";
  }

  if (!isValidTime(data.start_time)) {
    errors.start_time =
      "start_time is required and must be in HH:mm or HH:mm:ss format";
  }

  if (!isValidTime(data.end_time)) {
    errors.end_time =
      "end_time is required and must be in HH:mm or HH:mm:ss format";
  }

  if (data.day === undefined || data.day === null) {
    errors.day = "day is required";
  } else if (
    typeof data.day !== "number" ||
    !Number.isInteger(data.day) ||
    data.day < 1 ||
    data.day > 7
  ) {
    errors.day = "day must be an integer between 1 and 7";
  }

  if (data.grade === undefined || data.grade === null) {
    errors.grade = "grade is required";
  } else if (
    typeof data.grade !== "number" ||
    !Number.isInteger(data.grade) ||
    data.grade < 1
  ) {
    errors.grade = "grade must be a positive integer";
  }

  if (data.amount === undefined || data.amount === null) {
    errors.amount = "amount is required";
  } else if (typeof data.amount !== "number" || data.amount < 0) {
    errors.amount = "amount must be a non-negative number";
  }

  if (
    data.institute_commission !== undefined &&
    (typeof data.institute_commission !== "number" ||
      data.institute_commission < 0)
  ) {
    errors.institute_commission =
      "institute_commission must be a non-negative number";
  }

  if (data.description !== undefined && typeof data.description !== "string") {
    errors.description = "description must be a string";
  }

  if (data.location !== undefined && typeof data.location !== "string") {
    errors.location = "location must be a string";
  }

  if (
    data.student_count !== undefined &&
    (typeof data.student_count !== "number" ||
      !Number.isInteger(data.student_count) ||
      data.student_count < 0)
  ) {
    errors.student_count = "student_count must be a non-negative integer";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validation for updating a class
export const validateUpdateClass = (data) => {
  const errors = {};

  if (data.name !== undefined && typeof data.name !== "string") {
    errors.name = "name must be a string";
  }

  if (data.subject_id !== undefined && !isValidUuid(data.subject_id)) {
    errors.subject_id = "subject_id must be a valid UUID";
  }

  if (data.tutor_id !== undefined && !isValidUuid(data.tutor_id)) {
    errors.tutor_id = "tutor_id must be a valid UUID";
  }

  if (
    data.institute_id !== undefined &&
    data.institute_id !== null &&
    !isValidUuid(data.institute_id)
  ) {
    errors.institute_id = "institute_id must be a valid UUID or null";
  }

  if (data.start_time !== undefined && !isValidTime(data.start_time)) {
    errors.start_time = "start_time must be in HH:mm or HH:mm:ss format";
  }

  if (data.end_time !== undefined && !isValidTime(data.end_time)) {
    errors.end_time = "end_time must be in HH:mm or HH:mm:ss format";
  }

  if (data.day !== undefined) {
    if (
      typeof data.day !== "number" ||
      !Number.isInteger(data.day) ||
      data.day < 0 ||
      data.day > 6
    ) {
      errors.day = "day must be an integer between 0 and 6";
    }
  }

  if (data.grade !== undefined) {
    if (
      typeof data.grade !== "number" ||
      !Number.isInteger(data.grade) ||
      data.grade < 1
    ) {
      errors.grade = "grade must be a positive integer";
    }
  }

  if (data.amount !== undefined) {
    if (typeof data.amount !== "number" || data.amount < 0) {
      errors.amount = "amount must be a non-negative number";
    }
  }

  if (data.institute_commission !== undefined) {
    if (
      typeof data.institute_commission !== "number" ||
      data.institute_commission < 0
    ) {
      errors.institute_commission =
        "institute_commission must be a non-negative number";
    }
  }

  if (data.description !== undefined && typeof data.description !== "string") {
    errors.description = "description must be a string";
  }

  if (data.location !== undefined && typeof data.location !== "string") {
    errors.location = "location must be a string";
  }

  if (data.status !== undefined && typeof data.status !== "string") {
    errors.status = "status must be a string";
  }

  if (
    data.student_count !== undefined &&
    (typeof data.student_count !== "number" ||
      !Number.isInteger(data.student_count) ||
      data.student_count < 0)
  ) {
    errors.student_count = "student_count must be a non-negative integer";
  }

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
      error: "class id is required and must be a string",
    };
  }

  if (!UUID_REGEX.test(classId)) {
    return {
      isValid: false,
      error: "class id must be a valid UUID",
    };
  }

  return {
    isValid: true,
  };
};
