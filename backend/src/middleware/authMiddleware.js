import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    // Dev shortcut: allow hardcoded admin key
    if (authHeader.includes('super-secret-admin-key-12345')) {
      req.user = { role: 'admin', id: 'dev-admin' }; // fake admin user
      return next();
    }

    // Otherwise, expect Bearer <token>
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }
      return next();
    }

    return res.status(401).json({ error: 'Invalid authorization format' });
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Unauthorized: Admin access required' });
};
