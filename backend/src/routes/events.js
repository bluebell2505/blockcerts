// backend/src/routes/events.js
import express from "express";
import { createEvent, getEvents } from "../controllers/eventController.js";
import { adminAuth } from "../middleware/authMiddleware.js";
import { validateEvent } from "../utils/validator.js";

const router = express.Router();

router.post("/", adminAuth, validateEvent, createEvent);
router.get("/", getEvents);

export default router;