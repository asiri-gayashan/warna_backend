import { prisma } from "../../config/db.js";

const teacherInclude = {
  users: {
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
      address_line1: true,
      address_line2: true,
      description: true,
      district_id: true,
      status: true,
      role: true,
      created_at: true,
    },
  },
  subject: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const getAllTeachersService = async () => {
  try {
    const teachers = await prisma.tutor.findMany({
      include: teacherInclude,
      orderBy: {
        created_at: "desc",
      },
    });

    return teachers;
  } catch (error) {
    throw new Error(`Error fetching teachers: ${error.message}`);
  }
};

export const getTeacherByEmailService = async (email) => {
  try {
    const teacher = await prisma.tutor.findFirst({
      where: {
        users: {
          email,
        },
      },
      include: teacherInclude,
    });

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    return teacher;
  } catch (error) {
    if (error.message === "Teacher not found") {
      throw error;
    }
    throw new Error(`Error fetching teacher by email: ${error.message}`);
  }
};

export const getTeacherByIdService = async (teacherId) => {
  try {
    const teacher = await prisma.tutor.findUnique({
      where: { id: teacherId },
      include: teacherInclude,
    });

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    return teacher;
  } catch (error) {
    if (error.message === "Teacher not found") {
      throw error;
    }
    throw new Error(`Error fetching teacher: ${error.message}`);
  }
};

export const updateTeacherService = async (teacherId, data) => {
  try {
    const existingTeacher = await prisma.tutor.findUnique({
      where: { id: teacherId },
    });

    if (!existingTeacher) {
      throw new Error("Teacher not found");
    }

    const {
      subject_id,
      is_independent,
      ratings,
      qualifications,
      experience,
      dob,
      student_count,
      class_count,
      full_name,
      phone,
      address_line1,
      address_line2,
      description,
      district_id,
      status,
    } = data;

    const tutorData = {
      ...(subject_id !== undefined && { subject_id }),
      ...(is_independent !== undefined && { is_independent }),
      ...(ratings !== undefined && { ratings }),
      ...(qualifications !== undefined && { qualifications }),
      ...(experience !== undefined && { experience: parseInt(experience, 10) }),
      ...(dob !== undefined && { dob: new Date(dob) }),
      ...(student_count !== undefined && { student_count: parseInt(student_count, 10) }),
      ...(class_count !== undefined && { class_count: parseInt(class_count, 10) }),
    };

    const userData = {
      ...(full_name !== undefined && { full_name }),
      ...(phone !== undefined && { phone }),
      ...(address_line1 !== undefined && { address_line1 }),
      ...(address_line2 !== undefined && { address_line2 }),
      ...(description !== undefined && { description }),
      ...(district_id !== undefined && { district_id }),
      ...(status !== undefined && { status }),
    };

    const updatedTeacher = await prisma.$transaction(async (tx) => {
      if (Object.keys(tutorData).length > 0) {
        await tx.tutor.update({
          where: { id: teacherId },
          data: tutorData,
        });
      }

      if (Object.keys(userData).length > 0) {
        await tx.users.update({
          where: { id: existingTeacher.user_id },
          data: userData,
        });
      }

      return tx.tutor.findUnique({
        where: { id: teacherId },
        include: teacherInclude,
      });
    });

    return updatedTeacher;
  } catch (error) {
    if (error.message === "Teacher not found") {
      throw error;
    }
    throw new Error(`Error updating teacher: ${error.message}`);
  }
};

export const removeTeacherService = async (teacherId) => {
  try {
    const existingTeacher = await prisma.tutor.findUnique({
      where: { id: teacherId },
    });

    if (!existingTeacher) {
      throw new Error("Teacher not found");
    }

    const deletedTeacher = await prisma.$transaction(async (tx) => {
      const tutor = await tx.tutor.delete({
        where: { id: teacherId },
      });

      await tx.users.delete({
        where: { id: existingTeacher.user_id },
      });

      return tutor;
    });

    return deletedTeacher;
  } catch (error) {
    if (error.message === "Teacher not found") {
      throw error;
    }

    if (error.code === "P2003") {
      throw new Error(
        "Cannot delete teacher because related records exist (classes or payments)"
      );
    }

    throw new Error(`Error removing teacher: ${error.message}`);
  }
};
