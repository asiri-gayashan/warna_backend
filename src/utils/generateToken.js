import jwt from "jsonwebtoken";


 



// Generate short-lived access token
const generateAccessToken = (user) =>{
  const payload  = {
    id: user.id,
    email: user.email,
  }
  const accessToken =jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN})
  return accessToken;
} 
    
// Generate long-lived refresh token
const generateRefreshToken  = (user) =>{
  const payload = {
 
    id: user.id,
    fullname: user.fullName,
    email: user.email,
    role: user.role, 

  }   

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN })
  return refreshToken;
} 

// Verify access token
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};