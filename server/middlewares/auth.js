import pkg from "jsonwebtoken";
const { verify } = pkg;

export const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};
