import { prisma } from "../../config/db.js";

const buildDateFilter = (from, to) => {
  if (!from && !to) return undefined;
  return {
    ...(from && { gte: new Date(from) }),
    ...(to && { lte: new Date(to) }),
  };
};

const formatTime = (date) => new Date(date).toISOString().substring(11, 19);

// ── Class Report ─────────────────────────────────────────────
export const getClassReportService = async (instituteId, filters) => {
  try {
    const { grade, status, subject_id, from, to } = filters;

    const classes = await prisma.classes.findMany({
      where: {
        institute_id: instituteId,
        ...(grade && { grade: parseInt(grade) }),
        ...(status && { status }),
        ...(subject_id && { subject_id }),
        ...(from || to ? { created_at: buildDateFilter(from, to) } : {}),
      },
      include: {
        subject: { select: { name: true } },
        users_classes_tutor_idTousers: { select: { full_name: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return classes.map((c) => ({
      class_name: c.name,
      subject: c.subject?.name ?? "",
      grade: c.grade,
      tutor: c.users_classes_tutor_idTousers?.full_name ?? "",
      day: c.day,
      start_time: formatTime(c.start_time),
      end_time: formatTime(c.end_time),
      student_count: c.student_count ?? 0,
      amount: c.amount,
      commission_percent: c.institute_commission ?? 0,
      commission_value: parseFloat(
        (
          (c.amount * (c.student_count ?? 0) * (c.institute_commission ?? 0)) /
          100
        ).toFixed(2)
      ),
      status: c.status,
    }));
  } catch (error) {
    throw new Error(`Error generating class report: ${error.message}`);
  }
};

// ── Student Report ───────────────────────────────────────────
export const getStudentReportService = async (instituteId, filters) => {
  try {
    const { grade, status, from, to } = filters;

    const classIds = (
      await prisma.classes.findMany({
        where: { institute_id: instituteId },
        select: { id: true },
      })
    ).map((c) => c.id);

    const enrollments = await prisma.class_students.findMany({
      where: { class_id: { in: classIds } },
      select: { student_id: true },
    });

    const uniqueStudentUserIds = [
      ...new Set(enrollments.map((e) => e.student_id)),
    ];

    const students = await prisma.student.findMany({
      where: {
        user_id: { in: uniqueStudentUserIds },
        ...(grade && { grade: parseInt(grade) }),
        ...(from || to ? { created_at: buildDateFilter(from, to) } : {}),
        users: {
          ...(status && { status }),
        },
      },
      include: {
        users: {
          select: {
            full_name: true,
            email: true,
            phone: true,
            address_line1: true,
            status: true,
            district: { select: { name: true } },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    // Count enrolled classes per student within this institute
    const enrolledCounts = await Promise.all(
      students.map(async (s) => {
        const count = await prisma.class_students.count({
          where: {
            student_id: s.user_id,
            class_id: { in: classIds },
          },
        });
        return { userId: s.user_id, count };
      })
    );
    const countMap = Object.fromEntries(
      enrolledCounts.map((e) => [e.userId, e.count])
    );

    return students.map((s) => ({
      full_name: s.users?.full_name ?? "",
      email: s.users?.email ?? "",
      phone: s.users?.phone ?? "",
      address: s.users?.address_line1 ?? "",
      district: s.users?.district?.name ?? "",
      school: s.school ?? "",
      grade: s.grade ?? "",
      age: (() => {
        const dob = new Date(s.dob);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        if (
          today.getMonth() < dob.getMonth() ||
          (today.getMonth() === dob.getMonth() &&
            today.getDate() < dob.getDate())
        )
          age--;
        return age;
      })(),
      enrolled_classes: countMap[s.user_id] ?? 0,
      status: s.users?.status ?? "",
    }));
  } catch (error) {
    throw new Error(`Error generating student report: ${error.message}`);
  }
};

// ── Tutor Report ─────────────────────────────────────────────
export const getTutorReportService = async (instituteId, filters) => {
  try {
    const { status, subject_id, district_id } = filters;

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

    const tutors = await prisma.tutor.findMany({
      where: {
        user_id: { in: tutorUserIds },
        ...(subject_id && { subject_id }),
        users: {
          ...(status && { status }),
          ...(district_id && { district_id }),
        },
      },
      include: {
        subject: { select: { name: true } },
        users: {
          select: {
            full_name: true,
            email: true,
            phone: true,
            address_line1: true,
            status: true,
            district: { select: { name: true } },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    // Count classes per tutor within this institute
    const classCounts = await Promise.all(
      tutors.map(async (t) => {
        const count = await prisma.classes.count({
          where: {
            tutor_id: t.user_id,
            institute_id: instituteId,
          },
        });
        return { userId: t.user_id, count };
      })
    );
    const countMap = Object.fromEntries(
      classCounts.map((e) => [e.userId, e.count])
    );

    return tutors.map((t) => ({
      full_name: t.users?.full_name ?? "",
      email: t.users?.email ?? "",
      phone: t.users?.phone ?? "",
      address: t.users?.address_line1 ?? "",
      district: t.users?.district?.name ?? "",
      subject: t.subject?.name ?? "",
      experience: t.experience ?? 0,
      class_count: countMap[t.user_id] ?? 0,
      student_count: t.student_count ?? 0,
      rating: t.ratings ?? "N/A",
      status: t.users?.status ?? "",
    }));
  } catch (error) {
    throw new Error(`Error generating tutor report: ${error.message}`);
  }
};