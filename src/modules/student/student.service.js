import { prisma } from "../../config/db.js";

const studentInclude = {
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

      district: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};




const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};



export const getAllStudentsService = async () => {
  try {
    const students = await prisma.student.findMany({
      include: studentInclude,
      orderBy: {
        created_at: "desc",
      },
    });

    return students.map((student) => ({
      ...student,
      age: calculateAge(student.dob),
    }));
  } catch (error) {
    throw new Error(`Error fetching students: ${error.message}`);
  }
};

export const getStudentByEmailService = async (email) => {
  try {
    const student = await prisma.student.findFirst({
      where: {
        users: {
          email,
        },
      },
      include: studentInclude,
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // return student;
    return {
      ...student,
      age: calculateAge(student.dob),
    };

  } catch (error) {
    if (error.message === "Student not found") {
      throw error;
    }
    throw new Error(`Error fetching student by email: ${error.message}`);
  }
};

export const getStudentByIdService = async (studentId) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: studentInclude,
    });

    if (!student) {
      throw new Error("Student not found");
    }

    return {
      ...student,
      age: calculateAge(student.dob),
    };
  } catch (error) {
    if (error.message === "Student not found") {
      throw error;
    }
    throw new Error(`Error fetching student: ${error.message}`);
  }
};

export const updateStudentService = async (studentId, data) => {
  try {
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!existingStudent) {
      throw new Error("Student not found");
    }

    const studentData = {
      ...(data.dob !== undefined && { dob: new Date(data.dob) }),
      ...(data.school !== undefined && { school: data.school }),
      ...(data.grade !== undefined && {
        grade:
          data.grade === null ? null : parseInt(data.grade, 10),
      }),
    };

    const userData = {
      ...(data.full_name !== undefined && { full_name: data.full_name }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.address_line1 !== undefined && {
        address_line1: data.address_line1,
      }),
      ...(data.address_line2 !== undefined && {
        address_line2: data.address_line2,
      }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.district_id !== undefined && {
        district_id: data.district_id,
      }),
      ...(data.status !== undefined && { status: data.status }),
    };

    const hasStudentUpdates = Object.keys(studentData).length > 0;
    const hasUserUpdates = Object.keys(userData).length > 0;

    if (!hasStudentUpdates && !hasUserUpdates) {
      throw new Error("No valid fields to update");
    }

    const updatedStudent = await prisma.$transaction(async (tx) => {
      if (hasStudentUpdates) {
        await tx.student.update({
          where: { id: studentId },
          data: studentData,
        });
      }

      if (hasUserUpdates) {
        await tx.users.update({
          where: { id: existingStudent.user_id },
          data: userData,
        });
      }

      return tx.student.findUnique({
        where: { id: studentId },
        include: studentInclude,
      });
    });

    return updatedStudent;
  } catch (error) {
    if (error.message === "Student not found") {
      throw error;
    }
    throw new Error(`Error updating student: ${error.message}`);
  }
};

export const removeStudentService = async (studentId) => {
  try {
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!existingStudent) {
      throw new Error("Student not found");
    }

    const deletedStudent = await prisma.$transaction(async (tx) => {
      const student = await tx.student.delete({
        where: { id: studentId },
      });

      await tx.users.delete({
        where: { id: existingStudent.user_id },
      });

      return student;
    });

    return deletedStudent;
  } catch (error) {
    if (error.message === "Student not found") {
      throw error;
    }

    if (error.code === "P2003") {
      throw new Error(
        "Cannot delete student because related records exist"
      );
    }

    throw new Error(`Error removing student: ${error.message}`);
  }
};


export const getStudentsByTutorService = async (tutorId) => {
  try {
    const enrollments = await prisma.class_students.findMany({
      where: {
        classes: {
          tutor_id: tutorId,
        },
      },
      select: {
        student_id: true,
      },
    });

    const studentUserIds = [
      ...new Set(enrollments.map((item) => item.student_id)),
    ];

    const students = await prisma.student.findMany({
      where: {
        user_id: {
          in: studentUserIds,
        },
      },
      include: studentInclude,
      orderBy: {
        created_at: "desc",
      },
    });

    return students.map((student) => ({
      ...student,
      age: calculateAge(student.dob),
    }));
  } catch (error) {
    throw new Error(
      `Error fetching students by tutor: ${error.message}`
    );
  }
};

export const getStudentsByInstituteService = async (instituteId) => {
  try {
    const enrollments = await prisma.class_students.findMany({
      where: {
        classes: {
          institute_id: instituteId,
        },
      },
      select: {
        student_id: true,
      },
    });

    const studentUserIds = [
      ...new Set(enrollments.map((item) => item.student_id)),
    ];

    const students = await prisma.student.findMany({
      where: {
        user_id: {
          in: studentUserIds,
        },
      },
      include: studentInclude,
      orderBy: {
        created_at: "desc",
      },
    });

    return students.map((student) => ({
      ...student,
      age: calculateAge(student.dob),
    }));
  } catch (error) {
    throw new Error(
      `Error fetching students by institute: ${error.message}`
    );
  }
};



