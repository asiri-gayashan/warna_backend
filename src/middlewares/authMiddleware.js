import { verifyAccessToken } from "../utils/generateToken.js";

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ status: false, message: 'No token provided' });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { id, fullname, email, role }
    next();
  } catch (err) {
    // Token expired or invalid — Flutter will catch 401 and refresh
    return res.status(401).json({ status: false, message: 'Token expired or invalid' });
  }
};


// Example protected route
// router.get('/me', authenticate, (req, res) => {
//   res.json({ status: true, user: req.user });
// });

export { authenticate };