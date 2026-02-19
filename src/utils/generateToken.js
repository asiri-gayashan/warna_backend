import jwt from "jsonwebtoken";


export const generateToken = (user) => {
  const payload = {
    id: user.id,
    fullname: user.fullName,
    email: user.email,
    role: user.role,
  };    
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
  return token;
}




