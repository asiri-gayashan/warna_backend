const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ALLOWED_PAYMENT_STATUS = ["PAID", "NOTPAID"];

const ALLOWED_PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer", "Online"];

const isUUID = (value) => typeof value === "string" && UUID_REGEX.test(value);

const normalizeStatus = (status) => {
  if (typeof status !== "string") return status;
  return status.trim().toUpperCase();
};

export const validatePaymentId = (id) => {
  if (!id || typeof id !== "string") {
    return { isValid: false, error: "id is required and must be a string" };
  }
  if (!isUUID(id)) {
    return { isValid: false, error: "id must be a valid UUID" };
  }
  return { isValid: true };
};

export const validateClassAndMonth = (classId, month, year) => {
  if (!isUUID(classId)) {
    return { isValid: false, error: "classId must be a valid UUID" };
  }

  const m = parseInt(month);
  const y = parseInt(year);

  if (isNaN(m) || m < 1 || m > 12) {
    return {
      isValid: false,
      error: "month is required and must be between 1 and 12",
    };
  }

  if (isNaN(y) || y < 2000 || y > 2100) {
    return {
      isValid: false,
      error: "year is required and must be a valid year",
    };
  }

  return { isValid: true, month: m, year: y };
};

export const validateInsertPaymentsPayload = (payload) => {
  if (!Array.isArray(payload)) {
    return {
      isValid: false,
      errors: ["Request body must be an array of payment records"],
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

    if (!isUUID(item.student_id)) {
      errors.push(`Item at index ${idx}: student_id must be a valid UUID`);
    }

    if (!isUUID(item.class_id)) {
      errors.push(`Item at index ${idx}: class_id must be a valid UUID`);
    }

    if (!isUUID(item.marked_user_id)) {
      errors.push(`Item at index ${idx}: marked_user_id must be a valid UUID`);
    }

    if (!item.paid_date || isNaN(new Date(item.paid_date).getTime())) {
      errors.push(
        `Item at index ${idx}: paid_date is required and must be a valid date`
      );
    }

    if (
      item.payment_method !== undefined &&
      !ALLOWED_PAYMENT_METHODS.includes(item.payment_method)
    ) {
      errors.push(
        `Item at index ${idx}: payment_method must be one of ${ALLOWED_PAYMENT_METHODS.join(", ")}`
      );
    }
  });

  return { isValid: errors.length === 0, errors };
};

export const validateUpdatePaymentStatus = (data) => {
  if (!data || typeof data !== "object") {
    return { isValid: false, error: "Body is required" };
  }

  if (data.status === undefined || data.status === null) {
    return { isValid: false, error: "status is required" };
  }

  const normalized = normalizeStatus(data.status);
  if (!ALLOWED_PAYMENT_STATUS.includes(normalized)) {
    return {
      isValid: false,
      error: `status must be one of ${ALLOWED_PAYMENT_STATUS.join(", ")}`,
    };
  }

  return { isValid: true, normalizedStatus: normalized };
};