import jwt from "jsonwebtoken";

export const adminOnly = (req, res, next) => {
  const ADMIN_ID = "69dead45ef3e77a0bde5b8bd"; // your user id

  if (req.user.id !== ADMIN_ID) {
    return res.status(403).json({ msg: "Admin only" });
  }

  next();
};

export const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};