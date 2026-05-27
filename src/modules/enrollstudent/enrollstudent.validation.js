const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ALLOWED_STATUS = [
  "ACTIVE",
  "INACTIVE",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SUCCESS",
  "FAILED",
  "PAID",
  "NOTPAID",
];

const isUUID = (value) => typeof value === "string" && UUID_REGEX.test(value);

const normalizeStatus = (status) => {
  if (typeof status !== "string") return status;
  return status.trim().toUpperCase();
};

export const validateEnrollmentId = (id) => {
  if (!id || typeof id !== "string") {
    return { isValid: false, error: "id is required and must be a string" };
  }

  if (!isUUID(id)) {
    return { isValid: false, error: "id must be a valid UUID" };
  }

  return { isValid: true };
};

export const validateClassId = (id) => {
  // class_id uses the same UUID format as enrollment table id
  return validateEnrollmentId(id);
};

export const validateEnrollStudentsPayload = (payload) => {
  if (!Array.isArray(payload)) {
    return {
      isValid: false,
      errors: ["Request body must be an array of enrollments"],
    };
  }

  if (payload.length === 0) {
    return { isValid: false, errors: ["Array must not be empty"] };
  }

  const errors = [];

  payload.forEach((item, idx) => {
    if (!item || typeof item !== "object") {
      errors.push(`Item at index ${idx} must be an object`);
      return;
    }

    if (!isUUID(item.class_id)) {
      errors.push(`Item at index ${idx}: class_id must be a valid UUID`);
    }

    if (!isUUID(item.student_id)) {
      errors.push(`Item at index ${idx}: student_id must be a valid UUID`);
    }

    if (item.status !== undefined && item.status !== null) {
      const normalized = normalizeStatus(item.status);
      if (!ALLOWED_STATUS.includes(normalized)) {
        errors.push(
          `Item at index ${idx}: status must be one of ${ALLOWED_STATUS.join(", ")}`
        );
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpdateEnrollmentStatus = (data) => {
  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Body is required" };
  }

  if (data.status === undefined || data.status === null) {
    return { isValid: false, error: "status is required" };
  }

  const normalized = normalizeStatus(data.status);
  if (!ALLOWED_STATUS.includes(normalized)) {
    return {
      isValid: false,
      error: `status must be one of ${ALLOWED_STATUS.join(", ")}`,
    };
  }

  return { isValid: true, normalizedStatus: normalized };
};

