import { prisma } from "../../config/db.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, } from "../../utils/generateToken.js";



//------------------------------------------------------------------------- Register User -------------------------------------------------------------------------
const registerUser = async (req, res) => {
  try {
    const {
      // users table
      full_name,
      email,
      password,
      phone,
      role,
      district_id,
      address_line1,
      address_line2,
      description,

      // student table
      grade,
      dob,
      school,

      // tutor table
      subject_id,
      experience,
    } = req.body;

    let  userRoleData = {};

    // Check existing user
    const userExists = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });

    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({
          status: false,
          message: "Email already exists",
        });
      }

      if (userExists.phone === phone) {
        return res.status(400).json({
          status: false,
          message: "Phone already exists",
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.users.create({
      data: {
        full_name,
        email,
        password: hashedPassword,
        phone,
        role,
        district_id,
        address_line1,
        address_line2,
        description,
      },
    });

    // STUDENT
    if (role === "STUDENT") {
      userRoleData = await prisma.student.create({
        data: {
          users: {
            connect: {
              id: user.id,
            },
          },
      
          dob: new Date(dob),
          school,
          grade: parseInt(grade),
        },
      });
    }

    // TUTOR data a
    if (role === "TUTOR") {
      userRoleData = await prisma.tutor.create({
        data: {
          users: {
            connect: {
              id: user.id,
            },
          },
      
          subject: {
            connect: {
              id: subject_id,
            },
          },
      
          experience: parseInt(experience),
          dob: new Date(dob),
        },
      });
    }

    // INSTITUTE
    if (role === "INSTITUTE") {
      userRoleData = await prisma.institute.create({
        data: {
          user_id: user.id,
        },
      });
    }

    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      // userRoleData,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};



//------------------------------------------------------------------------- Login User -------------------------------------------------------------------------
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // console.log(req.body);

  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);


  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password!" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);


  // console.log(accessToken, refreshToken);
  res.status(200).json({ success: true, user, accessToken, refreshToken });

};



//------------------------------------------------------------------------- Refresh Token -------------------------------------------------------------------------

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: false,
        message: 'Refresh token required',
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({
        status: false,
        message: 'Invalid or expired refresh token',
      });
    }

    const user = {
      id: decoded.id,
      fullname: decoded.fullname,
      email: decoded.email,
      role: decoded.role,
    };

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = refreshToken;

    return res.json({
      status: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: 'Server error',
    });
  }
};


export { registerUser, loginUser, refresh };
