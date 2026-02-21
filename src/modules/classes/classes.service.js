import { prisma } from "../../config/db.js";

// Create a new class


export const createClassService = async (data) => {
  try {
    const class_data = await prisma.class.create({
      data: {
        teacherId: data.teacherId,
        subject: data.subject,
        grade: data.grade,
        name: data.name,

        // Schedule
        day: data.day,
        time: data.time,
        duration: data.duration,

        // Class Details
        location: data.location,
        description: data.description,

        // Optional
        status: data.status ?? true,
        instituteId: data.instituteId || null,
      },

      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return class_data;
  } catch (error) {
    throw new Error(`Error creating class: ${error.message}`);
  }
};





// Get all classes with optional filters
export const getAllClassesService = async (filters = {}) => {
  try {
    const where = {};

    if (filters.teacherId) {
      where.teacherId = filters.teacherId;
    }

    if (filters.grade) {
      where.grade = filters.grade;
    }

    if (filters.subject) {
      where.subject = {
        contains: filters.subject,
        mode: "insensitive",
      };
    }

    const classes = await prisma.Class.findMany({
      where,
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        students: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return classes;
  } catch (error) {
    throw new Error(`Error fetching classes: ${error.message}`);
  }
};

// Get class by ID
export const getClassByIdService = async (classId) => {
  try {
    const class_data = await prisma.Class.findUnique({
      where: {
        id: classId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        students: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!class_data) {
      throw new Error("Class not found");
    }

    return class_data;
  } catch (error) {
    throw new Error(`Error fetching class: ${error.message}`);
  }
};

// Update a class
export const updateClassService = async (classId, data) => {
  try {
    // Check if class exists
    const existingClass = await prisma.Class.findUnique({
      where: {
        id: classId,
      },
    });

    if (!existingClass) {
      throw new Error("Class not found");
    }

    // Update class
    const updatedClass = await prisma.Class.update({
      where: {
        id: classId,
      },
      data: {
        ...(data.grade && { grade: data.grade }),
        ...(data.subject && { subject: data.subject }),
        ...(data.name && { name: data.name }),
        ...(data.schedule_day && { schedule_day: data.schedule_day }),
        ...(data.schedule_time && { schedule_time: data.schedule_time }),
        ...(data.end_time && { end_time: data.end_time }),
        ...(data.instituteId !== undefined && { instituteId: data.instituteId }),
      },
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        students: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return updatedClass;
  } catch (error) {
    throw new Error(`Error updating class: ${error.message}`);
  }
};

// Delete a class
export const deleteClassService = async (classId) => {
  try {
    // Check if class exists
    const existingClass = await prisma.Class.findUnique({
      where: {
        id: classId,
      },
    });

    if (!existingClass) {
      throw new Error("Class not found");
    }

    // Delete class (cascade delete will handle ClassStudent records)
    const deletedClass = await prisma.Class.delete({
      where: {
        id: classId,
      },
    });

    return deletedClass;
  } catch (error) {
    throw new Error(`Error deleting class: ${error.message}`);
  }
};
