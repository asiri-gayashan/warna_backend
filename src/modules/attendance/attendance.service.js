import { prisma } from "../../config/db.js";

const formatAttendanceRow = (row) => {
  const studentUser = row.users_attendance_student_idTousers;
  const studentProfile = studentUser?.student;

  return {
    id: row.id,
    class_id: row.class_id,
    student_id: row.student_id,
    status: row.status,
    marked_user_id: row.marked_user_id,
    created_at: row.created_at,
    student_full_name: studentUser?.full_name ?? null,
    student_phone: studentUser?.phone ?? null,
    student_grade: studentProfile?.grade ?? null,
  };
};

export const getAttendanceByClassAndDateService = async (classId, date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const rows = await prisma.attendance.findMany({
      where: {
        class_id: classId,
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        users_attendance_student_idTousers: {
          select: {
            id: true,
            full_name: true,
            phone: true,
            student: {
              select: { grade: true },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return rows.map(formatAttendanceRow);
  } catch (error) {
    throw new Error(`Error fetching attendance: ${error.message}`);
  }
};

export const insertAttendanceService = async (records) => {
  try {
    const createdRows = [];

    for (const item of records) {
      const created = await prisma.attendance.create({
        data: {
          class_id: item.class_id,
          student_id: item.student_id,
          status: item.status,
          marked_user_id: item.marked_user_id,
        },
        include: {
          users_attendance_student_idTousers: {
            select: {
              id: true,
              full_name: true,
              phone: true,
              student: {
                select: { grade: true },
              },
            },
          },
        },
      });

      createdRows.push(formatAttendanceRow(created));
    }

    return createdRows;
  } catch (error) {
    throw new Error(`Error inserting attendance: ${error.message}`);
  }
};

export const updateAttendanceStatusService = async (id, status) => {
  try {
    const existing = await prisma.attendance.findUnique({ where: { id } });

    if (!existing) throw new Error("Attendance record not found");

    const updated = await prisma.attendance.update({
      where: { id },
      data: { status },
      include: {
        users_attendance_student_idTousers: {
          select: {
            id: true,
            full_name: true,
            phone: true,
            student: {
              select: { grade: true },
            },
          },
        },
      },
    });

    return formatAttendanceRow(updated);
  } catch (error) {
    if (error.message === "Attendance record not found") throw error;
    throw new Error(`Error updating attendance: ${error.message}`);
  }
};