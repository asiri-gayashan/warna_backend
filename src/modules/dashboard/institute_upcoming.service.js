import { prisma } from "../../config/db.js";

const classInclude = {
  subject: { select: { id: true, name: true } },
  users_classes_tutor_idTousers: {
    select: { id: true, full_name: true },
  },
};

const formatTime = (date) => new Date(date).toISOString().substring(11, 19);

const formatDuration = (start, end) => {
  const diff = Math.round((new Date(end) - new Date(start)) / 60000);
  if (diff <= 0) return "0m";
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
};

export const getUpcomingClassesService = async (instituteId) => {
  try {
    const todayDay = new Date().getDay(); // 0=Sun … 6=Sat

    const classes = await prisma.classes.findMany({
      where: {
        institute_id: instituteId,
        status: "ACTIVE",
      },
      include: classInclude,
      orderBy: [{ day: "asc" }, { start_time: "asc" }],
      take: 10,
    });

    // Sort: classes from today onward first, then wrap around
    const sorted = [
      ...classes.filter((c) => c.day >= todayDay),
      ...classes.filter((c) => c.day < todayDay),
    ].slice(0, 5);

    return sorted.map((c) => ({
      id: c.id,
      name: c.name,
      grade: c.grade,
      subject_name: c.subject?.name ?? "",
      tutor_name: c.users_classes_tutor_idTousers?.full_name ?? "",
      start_time: formatTime(c.start_time),
      end_time: formatTime(c.end_time),
      duration: formatDuration(c.start_time, c.end_time),
      day: c.day,
      status: c.status,
    }));
  } catch (error) {
    throw new Error(`Error fetching upcoming classes: ${error.message}`);
  }
};