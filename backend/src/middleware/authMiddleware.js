// backend/src/middleware/authMiddleware.js
export const adminAuth = (req, res, next) => {
  try {
    const token = req.headers["x-admin-token"];
    if (!token) return res.status(401).json({ error: "No admin token provided" });

    if (token !== process.env.ADMIN_TOKEN)
      return res.status(403).json({ error: "Unauthorized access" });

    next();
  } catch (err) {
    res.status(500).json({ error: "Auth middleware error" });
  }
};
