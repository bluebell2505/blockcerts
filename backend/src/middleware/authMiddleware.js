export const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    
    // Simple check for development
    if (authHeader && authHeader.includes('super-secret-admin-key-12345')) {
      return next();
    }

    return res.status(403).json({ error: "Unauthorized: Admin access required" });

  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
};