import { prisma } from "../../config/db.js";

const formatEnrollmentRow = (row) => {
  const studentUser = row.users;
  const studentProfile = studentUser?.student;

  return {
    id: row.id,
    class_id: row.class_id,
    student_id: row.student_id,
    status: row.status,
    joined_at: row.created_at,
    student_full_name: studentUser?.full_name ?? null,
    student_phone: studentUser?.phone ?? null,
    student_grade: studentProfile?.grade ?? null,
  };
};

export const getAllEnrollStudentsService = async () => {
  try {
    const rows = await prisma.class_students.findMany({
      include: {
        users: {
          select: {
            id: true,
            full_name: true,
            phone: true,
            student: {
              select: {
                grade: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return rows.map(formatEnrollmentRow);
  } catch (error) {
    throw new Error(`Error fetching enrollments: ${error.message}`);
  }
};

export const insertEnrollStudentsService = async (enrollments) => {
  try {
    const createdRows = [];

    for (const item of enrollments) {
      const created = await prisma.$transaction(async (tx) => {
        // create enrollment
        const enrollment = await tx.class_students.create({
          data: {
            class_id: item.class_id,
            student_id: item.student_id,
            status:
              item.status === undefined || item.status === null
                ? null
                : item.status,
          },
          include: {
            users: {
              select: {
                id: true,
                full_name: true,
                phone: true,
                student: {
                  select: {
                    grade: true,
                  },
                },
              },
            },
          },
        });

        // increment class student count
        await tx.classes.update({
          where: {
            id: item.class_id,
          },
          data: {
            student_count: {
              increment: 1,
            },
          },
        });

        return enrollment;
      });

      createdRows.push(formatEnrollmentRow(created));
    }

    return createdRows;
  } catch (error) {
    throw new Error(`Error inserting enrollments: ${error.message}`);
  }
};

export const updateEnrollmentStatusService = async (id, status) => {
  try {
    const existing = await prisma.class_students.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Enrollment not found");
    }

    const updated = await prisma.class_students.update({
      where: { id },
      data: { status },
      include: {
        users: {
          select: {
            id: true,
            full_name: true,
            phone: true,
            student: {
              select: {
                grade: true,
              },
            },
          },
        },
      },
    });

    return formatEnrollmentRow(updated);
  } catch (error) {
    if (error.message === "Enrollment not found") throw error;

    throw new Error(`Error updating enrollment: ${error.message}`);
  }
};

export const getAllEnrollStudentsByClassIdService = async (classId) => {
  try {
    const rows = await prisma.class_students.findMany({
      where: {
        class_id: classId,
      },
      include: {
        users: {
          select: {
            id: true,
            full_name: true,
            phone: true,
            student: {
              select: {
                grade: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return rows.map(formatEnrollmentRow);
  } catch (error) {
    throw new Error(
      `Error fetching enrollments by classId: ${error.message}`
    );
  }
};