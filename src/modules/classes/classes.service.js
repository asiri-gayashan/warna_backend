import { prisma } from "../../config/db.js";

const SCHEDULE_CONFLICT_MESSAGE =
  "This teacher already has a class at this institute with an overlapping time on the same day.";

const toTimeDate = (time) => {
  if (time instanceof Date) {
    return time;
  }
  return new Date(`1970-01-01T${time}Z`);
};

const classInclude = {
  subject: {
    select: {
      id: true,
      name: true,
    },
  },
  users_classes_tutor_idTousers: {
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
    },
  },
  users_classes_institute_idTousers: {
    select: {
      id: true,
      full_name: true,
    },
  },
};

const formatTime = (date) => {
  const d = new Date(date);
  return d.toISOString().substring(11, 19);
};

const formatDuration = (startTime, endTime) => {
  const diffMs = new Date(endTime) - new Date(startTime);
  const totalMinutes = Math.round(diffMs / 60000);

  if (totalMinutes <= 0) {
    return "0m";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}m`;
};

const formatClassResponse = (classItem) => {
  const {
    subject,
    users_classes_tutor_idTousers,
    users_classes_institute_idTousers,
    ...rest
  } = classItem;

  return {
    ...rest,
    subject_name: subject?.name ?? null,
    tutor_name: users_classes_tutor_idTousers?.full_name ?? null,
    institute_name: users_classes_institute_idTousers?.full_name ?? null,
    duration: formatDuration(rest.start_time, rest.end_time),
    start_time: formatTime(rest.start_time),
    end_time: formatTime(rest.end_time),
  };
};

const findScheduleConflict = async ({
  tutor_id,
  institute_id,
  day,
  start_time,
  end_time,
  excludeId,
}) => {
  return prisma.classes.findFirst({
    where: {
      tutor_id,
      institute_id: institute_id ?? null,
      day,
      ...(excludeId && { id: { not: excludeId } }),
      start_time: { lt: end_time },
      end_time: { gt: start_time },
    },
  });
};

export const createClassService = async (data) => {
  try {
    const start_time = toTimeDate(data.start_time);
    const end_time = toTimeDate(data.end_time);

    const conflict = await findScheduleConflict({
      tutor_id: data.tutor_id,
      institute_id: data.institute_id,
      day: data.day,
      start_time,
      end_time,
    });

    if (conflict) {
      throw new Error(SCHEDULE_CONFLICT_MESSAGE);
    }

    const class_data = await prisma.classes.create({
      data: {
        name: data.name,
        subject_id: data.subject_id,
        tutor_id: data.tutor_id,
        institute_id: data.institute_id,
        start_time,
        end_time,
        day: data.day,
        description: data.description,
        location: data.location,
        grade: data.grade,
        amount: data.amount,
        institute_commission: data.institute_commission,
        status: data.status || "ACTIVE",
        student_count: data.student_count ?? 0,
      },
    });

    return class_data;
  } catch (error) {
    if (error.message === SCHEDULE_CONFLICT_MESSAGE) {
      throw error;
    }
    throw new Error(`Error creating class: ${error.message}`);
  }
};

export const getAllClassesService = async () => {
  try {
    const classes = await prisma.classes.findMany({
      include: classInclude,
      orderBy: {
        created_at: "desc",
      },
    });

    return classes.map(formatClassResponse);
  } catch (error) {
    throw new Error(`Error fetching classes: ${error.message}`);
  }
};

export const getClassByIdService = async (classId) => {
  try {
    const class_data = await prisma.classes.findUnique({
      where: { id: classId },
      include: classInclude,
    });

    if (!class_data) {
      throw new Error("Class not found");
    }

    return formatClassResponse(class_data);
  } catch (error) {
    if (error.message === "Class not found") {
      throw error;
    }
    throw new Error(`Error fetching class: ${error.message}`);
  }
};

export const updateClassService = async (classId, data) => {
  try {
    const existingClass = await prisma.classes.findUnique({
      where: { id: classId },
    });

    if (!existingClass) {
      throw new Error("Class not found");
    }

    const tutor_id = data.tutor_id ?? existingClass.tutor_id;
    const institute_id =
      data.institute_id !== undefined
        ? data.institute_id
        : existingClass.institute_id;
    const day = data.day ?? existingClass.day;
    const start_time = data.start_time
      ? toTimeDate(data.start_time)
      : existingClass.start_time;
    const end_time = data.end_time
      ? toTimeDate(data.end_time)
      : existingClass.end_time;

    const conflict = await findScheduleConflict({
      tutor_id,
      institute_id,
      day,
      start_time,
      end_time,
      excludeId: classId,
    });

    if (conflict) {
      throw new Error(SCHEDULE_CONFLICT_MESSAGE);
    }

    const updatedClass = await prisma.classes.update({
      where: { id: classId },
      data: {
        ...data,
        ...(data.start_time && { start_time }),
        ...(data.end_time && { end_time }),
      },
    });

    return updatedClass;
  } catch (error) {
    if (
      error.message === "Class not found" ||
      error.message === SCHEDULE_CONFLICT_MESSAGE
    ) {
      throw error;
    }
    throw new Error(`Error updating class: ${error.message}`);
  }
};

export const deleteClassService = async (classId) => {
  try {
    const existingClass = await prisma.classes.findUnique({
      where: { id: classId },
    });

    if (!existingClass) {
      throw new Error("Class not found");
    }

    const deletedClass = await prisma.classes.delete({
      where: { id: classId },
    });

    return deletedClass;
  } catch (error) {
    if (error.message === "Class not found") {
      throw error;
    }
    throw new Error(`Error deleting class: ${error.message}`);
  }
};



export const getClassesByTutorAndInstituteService = async (tutorId, instituteId) => {
  try {
    const classes = await prisma.classes.findMany({
      where: {
        tutor_id: tutorId,
        institute_id: instituteId,
      },
      include: classInclude,
      orderBy: {
        created_at: "desc",
      },
    });

    return classes.map(formatClassResponse);
  } catch (error) {
    throw new Error(`Error fetching classes by tutor and institute: ${error.message}`);
  }
};



export const getStudentClassesByInstituteService = async (
  studentId,
  instituteId
) => {
  try {
    const classes = await prisma.class_students.findMany({
      where: {
        student_id: studentId,
        classes: {
          institute_id: instituteId,
        },
      },
      include: {
        classes: {
          include: classInclude,
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return classes.map((item) =>
      formatClassResponse(item.classes)
    );
  } catch (error) {
    throw new Error(
      `Error fetching student classes: ${error.message}`
    );
  }
};
