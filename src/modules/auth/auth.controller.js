import { prisma } from "../../config/db.js";
import bcrypt from "bcrypt";
import {generateToken} from "../../utils/generateToken.js";

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


  
  const token = generateToken(user);


 res.status(201).json({
      status: "true",
      data: user,
      token,
    });

  // res.json({ message: "User Registered", data: user, token });
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

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
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user);

  res.json({  status: true, data: user, token });


 
};

export { registerUser, loginUser };
