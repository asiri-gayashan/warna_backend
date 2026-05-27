const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ALLOWED_ATTENDANCE_STATUS = ["PRESENT", "ABSENT"];

const isUUID = (value) => typeof value === "string" && UUID_REGEX.test(value);

const normalizeStatus = (status) => {
  if (typeof status !== "string") return status;
  return status.trim().toUpperCase();
};

export const validateAttendanceId = (id) => {
  if (!id || typeof id !== "string") {
    return { isValid: false, error: "id is required and must be a string" };
  }
  if (!isUUID(id)) {
    return { isValid: false, error: "id must be a valid UUID" };
  }
  return { isValid: true };
};

export const validateClassIdAndDate = (classId, date) => {
  if (!isUUID(classId)) {
    return { isValid: false, error: "classId must be a valid UUID" };
  }
  if (!date || isNaN(new Date(date).getTime())) {
    return {
      isValid: false,
      error: "date is required and must be a valid date (YYYY-MM-DD)",
    };
  }
  return { isValid: true };
};

export const validateInsertAttendancePayload = (payload) => {
  if (!Array.isArray(payload)) {
    return {
      isValid: false,
      errors: ["Request body must be an array of attendance records"],
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

    if (!isUUID(item.marked_user_id)) {
      errors.push(`Item at index ${idx}: marked_user_id must be a valid UUID`);
    }

    if (!item.status) {
      errors.push(`Item at index ${idx}: status is required`);
    } else {
      const normalized = normalizeStatus(item.status);
      if (!ALLOWED_ATTENDANCE_STATUS.includes(normalized)) {
        errors.push(
          `Item at index ${idx}: status must be one of ${ALLOWED_ATTENDANCE_STATUS.join(", ")}`
        );
      }
    }
  });

  return { isValid: errors.length === 0, errors };
};

export const validateUpdateAttendanceStatus = (data) => {
  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Body is required" };
  }

  if (data.status === undefined || data.status === null) {
    return { isValid: false, error: "status is required" };
  }

  const normalized = normalizeStatus(data.status);
  if (!ALLOWED_ATTENDANCE_STATUS.includes(normalized)) {
    return {
      isValid: false,
      error: `status must be one of ${ALLOWED_ATTENDANCE_STATUS.join(", ")}`,
    };
  }

  return { isValid: true, normalizedStatus: normalized };
};