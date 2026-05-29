const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isUUID = (value) => typeof value === "string" && UUID_REGEX.test(value);

const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return { isValid: false, error: "Email is required and must be a string" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Email must be a valid email address" };
  }

  return { isValid: true };
};

export const validateStudentId = (studentId) => {
  if (!studentId || typeof studentId !== "string") {
    return {
      isValid: false,
      error: "Student id is required and must be a string",
    };
  }

  if (!isUUID(studentId)) {
    return {
      isValid: false,
      error: "Student id must be a valid UUID",
    };
  }

  return { isValid: true };
};

export { validateEmail };

