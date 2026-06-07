import { prisma } from "../../config/db.js";

const classInclude = {
  subject: { select: { id: true, name: true } },
  users_classes_tutor_idTousers: {
    select: { id: true, full_name: true },
  },
};

export const getClassPerformanceService = async (instituteId) => {
  try {
    const classes = await prisma.classes.findMany({
      where: { institute_id: instituteId },
      include: classInclude,
      orderBy: { student_count: "desc" },
    });

    const formatted = classes.map((c) => ({
      id: c.id,
      name: c.name,
      grade: c.grade,
      student_count: c.student_count ?? 0,
      subject_name: c.subject?.name ?? "",
      tutor_name: c.users_classes_tutor_idTousers?.full_name ?? "",
      status: c.status,
    }));

    return {
      top_classes: formatted.slice(0, 3),
      least_classes: [...formatted].reverse().slice(0, 2),
    };
  } catch (error) {
    throw new Error(`Error fetching class performance: ${error.message}`);
  }
};