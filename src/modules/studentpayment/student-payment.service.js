import { prisma } from "../../config/db.js";

const formatPaymentRow = (row) => {
  const studentUser = row.users_student_payment_student_idTousers;
  const studentProfile = studentUser?.student;

  return {
    id: row.id,
    class_id: row.class_id,
    student_id: row.student_id,
    paid_date: row.paid_date,
    status: row.status,
    payment_method: row.payment_method,
    marked_user_id: row.marked_user_id,
    created_at: row.created_at,
    student_full_name: studentUser?.full_name ?? null,
    student_phone: studentUser?.phone ?? null,
    student_grade: studentProfile?.grade ?? null,
    class_amount: row.classes?.amount ?? null,
  };
};

// GET all payments for a class filtered by month and year
export const getPaymentsByClassAndMonthService = async (
  classId,
  month,
  year
) => {
  try {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const rows = await prisma.student_payment.findMany({
      where: {
        class_id: classId,
        paid_date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        users_student_payment_student_idTousers: {
          select: {
            id: true,
            full_name: true,
            phone: true,
            student: {
              select: { grade: true },
            },
          },
        },
        classes: {
          select: { amount: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return rows.map(formatPaymentRow);
  } catch (error) {
    throw new Error(`Error fetching payments: ${error.message}`);
  }
};

// INSERT payment — one record per student per class per month
// Business rule: cannot mark two payments for same class in same month
export const insertStudentPaymentService = async (payments) => {
  try {
    const createdRows = [];

    for (const item of payments) {
      const paidDate = new Date(item.paid_date);
      const month = paidDate.getMonth(); // 0-indexed
      const year = paidDate.getFullYear();

      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

      // Check if payment already exists for this student + class + month
      const existing = await prisma.student_payment.findFirst({
        where: {
          student_id: item.student_id,
          class_id: item.class_id,
          paid_date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });

      if (existing) {
        throw new Error(
          `Payment already exists for student ${item.student_id} in class ${item.class_id} for ${paidDate.toLocaleString("default", { month: "long" })} ${year}`
        );
      }

      const created = await prisma.student_payment.create({
        data: {
          student_id: item.student_id,
          class_id: item.class_id,
          paid_date: paidDate,
          status: "PAID",
          payment_method: item.payment_method ?? "Cash",
          marked_user_id: item.marked_user_id,
        },
        include: {
          users_student_payment_student_idTousers: {
            select: {
              id: true,
              full_name: true,
              phone: true,
              student: {
                select: { grade: true },
              },
            },
          },
          classes: {
            select: { amount: true },
          },
        },
      });

      createdRows.push(formatPaymentRow(created));
    }

    return createdRows;
  } catch (error) {
    throw error;
  }
};

// UPDATE payment status — PAID or NOTPAID
export const updateStudentPaymentStatusService = async (id, status) => {
  try {
    const existing = await prisma.student_payment.findUnique({
      where: { id },
    });

    if (!existing) throw new Error("Payment record not found");

    const updated = await prisma.student_payment.update({
      where: { id },
      data: { status },
      include: {
        users_student_payment_student_idTousers: {
          select: {
            id: true,
            full_name: true,
            phone: true,
            student: {
              select: { grade: true },
            },
          },
        },
        classes: {
          select: { amount: true },
        },
      },
    });

    return formatPaymentRow(updated);
  } catch (error) {
    if (error.message === "Payment record not found") throw error;
    throw new Error(`Error updating payment: ${error.message}`);
  }
};