import { prisma } from "../../config/db.js";

const buildMonthFilter = (month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { gte: start, lt: end };
};

// ── Finance Summary ───────────────────────────────────────────
export const getFinanceSummaryService = async (instituteId, month, year) => {
  try {
    const dateFilter = buildMonthFilter(month, year);

    const classes = await prisma.classes.findMany({
      where: { institute_id: instituteId },
      select: {
        id: true,
        amount: true,
        student_count: true,
        institute_commission: true,
      },
    });

    const classIds = classes.map((c) => c.id);

    const totalRevenue = classes.reduce(
      (sum, c) => sum + c.amount * (c.student_count ?? 0),
      0
    );

    // Received = paid student payments this month
    const paidPayments = await prisma.student_payment.findMany({
      where: {
        class_id: { in: classIds },
        status: "PAID",
        paid_date: dateFilter,
      },
      select: { class_id: true },
    });

    // Map class amount for calculation
    const classAmountMap = Object.fromEntries(
      classes.map((c) => [c.id, c.amount])
    );

    const totalReceived = paidPayments.reduce(
      (sum, p) => sum + (classAmountMap[p.class_id] ?? 0),
      0
    );

    const totalPending = totalRevenue - totalReceived;

    // ── Commission received — per class, using each class's own % ──
    // Group paid payments by class_id to get paid count per class
    const paidCountPerClass = {};
    for (const p of paidPayments) {
      paidCountPerClass[p.class_id] =
        (paidCountPerClass[p.class_id] ?? 0) + 1;
    }

    // Build commission map: class_id → commission %
    const classCommissionMap = Object.fromEntries(
      classes.map((c) => [c.id, c.institute_commission ?? 0])
    );

    // For each class: received from that class × its commission %
    const commissionReceived = Object.entries(paidCountPerClass).reduce(
      (sum, [classId, count]) => {
        const receivedForClass = count * (classAmountMap[classId] ?? 0);
        const commissionPct = classCommissionMap[classId] ?? 0;
        return sum + (receivedForClass * commissionPct) / 100;
      },
      0
    );


    return {
      commission_received: parseFloat(commissionReceived.toFixed(2)),
      total_revenue: parseFloat(totalRevenue.toFixed(2)),
      total_received: parseFloat(totalReceived.toFixed(2)),
      total_pending: parseFloat(totalPending.toFixed(2)),
    };
  } catch (error) {
    throw new Error(`Error fetching finance summary: ${error.message}`);
  }
};

// ── Classes Finance ───────────────────────────────────────────
export const getClassesFinanceService = async (instituteId, month, year) => {
  try {
    const dateFilter = buildMonthFilter(month, year);

    const classes = await prisma.classes.findMany({
      where: { institute_id: instituteId },
      include: {
        users_classes_tutor_idTousers: {
          select: { full_name: true },
        },
        class_students: {
          select: { student_id: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    const result = await Promise.all(
      classes.map(async (cls) => {
        const totalCount = cls.class_students.length;
        const revenue = cls.amount * (cls.student_count ?? 0);
        const commission = (revenue * (cls.institute_commission ?? 0)) / 100;

        // Paid student payments this month for this class
        const paidPayments = await prisma.student_payment.findMany({
          where: {
            class_id: cls.id,
            status: "PAID",
            paid_date: dateFilter,
          },
          select: { student_id: true },
        });

        const paidCount = paidPayments.length;
        const unpaidCount = Math.max(0, totalCount - paidCount);
        const received = paidCount * cls.amount;
        const pending = Math.max(0, revenue - received);

        // Check if tutor has been paid this month for this class
        const tutorPayment = await prisma.tutor_payments.findFirst({
          where: {
            class_id: cls.id,
            status: "PAID",
            paid_date: dateFilter,
          },
        });

        return {
          id: cls.id,
          name: cls.name,
          grade: cls.grade,
          tutor_name:
            cls.users_classes_tutor_idTousers?.full_name ?? "",
          teacher_paid: tutorPayment !== null,
          revenue: parseFloat(revenue.toFixed(2)),
          commission: parseFloat(commission.toFixed(2)),
          received: parseFloat(received.toFixed(2)),
          pending: parseFloat(pending.toFixed(2)),
          paid_count: paidCount,
          unpaid_count: unpaidCount,
          total_count: totalCount,
        };
      })
    );

    return result;
  } catch (error) {
    throw new Error(`Error fetching classes finance: ${error.message}`);
  }
};

// ── Teachers Finance ──────────────────────────────────────────
export const getTeachersFinanceService = async (instituteId, month, year) => {
  try {
    const dateFilter = buildMonthFilter(month, year);

    const classes = await prisma.classes.findMany({
      where: { institute_id: instituteId },
      include: {
        users_classes_tutor_idTousers: {
          select: { id: true, full_name: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    const result = await Promise.all(
      classes.map(async (cls) => {
        const commission =
          (cls.amount *
            (cls.student_count ?? 0) *
            (cls.institute_commission ?? 0)) /
          100;

        const tutorPayment = await prisma.tutor_payments.findFirst({
          where: {
            class_id: cls.id,
            status: "PAID",
            paid_date: dateFilter,
          },
        });

        return {
          tutor_id:
            cls.users_classes_tutor_idTousers?.id ?? "",
          tutor_name:
            cls.users_classes_tutor_idTousers?.full_name ?? "",
          class_name: cls.name,
          grade: cls.grade,
          commission: parseFloat(commission.toFixed(2)),
          paid: tutorPayment !== null,
        };
      })
    );

    return result;
  } catch (error) {
    throw new Error(`Error fetching teachers finance: ${error.message}`);
  }
};