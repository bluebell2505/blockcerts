import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import eventRoutes from "./routes/events.js";
import registrationRoutes from "./routes/registrations.js";
import attendanceRoutes from "./routes/attendance.js";
import certificateRoutes from "./routes/certificates.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// routes
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/certificates", certificateRoutes);

// global error handler
app.use(errorHandler);

export default app;
