import { prisma } from "../../config/db.js";
import bcrypt from "bcrypt";
import {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken,} from "../../utils/generateToken.js";

const registerUser = async (req, res) => {
  const { fullName, email, mobile, password, role, province, address } = req.body;

  const userExists = await prisma.User.findUnique({
    where: {
      email: email,
    },
  });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.User.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      mobile,
      role,
      province,
      address,
    },
  });

  


  
  // const token = generateToken(user);


 res.status(200).json({
      status: "true",
      data: user,
      // token,
    });

  // res.json({ message: "User Registered", data: user, token });
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // console.log(req.body);

  const user = await prisma.User.findUnique({
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
  res.status(200).json({  success: true, user, accessToken, refreshToken });

}; 

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
    const newAccessToken  = generateAccessToken(user);
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
