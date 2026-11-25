import jwt from "jsonwebtoken";
import User from "../Schema/User.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const h = req.headers.authorization;
    const token = h?.startsWith("Bearer ") ? h.split(" ")[1] : req.cookies?.token;
    if (!token) return res.status(401).json({ success: false, message: "Please login first" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "User no longer exists" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const isManager = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
};