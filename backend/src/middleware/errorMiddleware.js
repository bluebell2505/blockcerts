// backend/src/middleware/errorMiddleware.js
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};
