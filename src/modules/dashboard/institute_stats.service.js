import { prisma } from "../../config/db.js";

export const getInstituteStatsService = async (instituteId) => {
  try {
    // All classes belonging to this institute
    const classes = await prisma.classes.findMany({
      where: { institute_id: instituteId },
      select: {
        id: true,
        student_count: true,
        amount: true,
        institute_commission: true,
        status: true,
      },
    });

    const classIds = classes.map((c) => c.id);

    // Unique students enrolled in any institute class
    const enrollments = await prisma.class_students.findMany({
      where: { class_id: { in: classIds } },
      select: { student_id: true },
    });
    const uniqueStudentCount = new Set(
      enrollments.map((e) => e.student_id)
    ).size;

    // Unique tutors teaching in this institute
    const tutorUserIds = [
      ...new Set(
        (
          await prisma.classes.findMany({
            where: { institute_id: instituteId },
            select: { tutor_id: true },
          })
        ).map((c) => c.tutor_id)
      ),
    ];
    const uniqueTutorCount = tutorUserIds.length;

    const totalClasses = classes.length;
    const activeClasses = classes.filter((c) => c.status === "ACTIVE").length;

    // Monthly revenue — sum of (amount * student_count) for active classes
    const monthlyRevenue = classes
      .filter((c) => c.status === "ACTIVE")
      .reduce((sum, c) => sum + c.amount * (c.student_count ?? 0), 0);

    // Total commission earned by institute
    const totalCommission = classes
      .filter((c) => c.status === "ACTIVE")
      .reduce(
        (sum, c) =>
          sum +
          (c.amount * (c.student_count ?? 0) * (c.institute_commission ?? 0)) /
            100,
        0
      );

    return {
      total_students: uniqueStudentCount,
      total_tutors: uniqueTutorCount,
      total_classes: totalClasses,
      active_classes: activeClasses,
      monthly_revenue: parseFloat(monthlyRevenue.toFixed(2)),
      total_commission: parseFloat(totalCommission.toFixed(2)),
    };
  } catch (error) {
    throw new Error(`Error fetching institute stats: ${error.message}`);
  }
};