import express from "express";
import { createEvent, getEvents } from "../controllers/eventController.js";
import { adminAuth } from "../middleware/authMiddleware.js";
import { validateEvent } from "../utils/validator.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Add posters (multiple) + speakers (optional)
router.post(
  "/",
  adminAuth,
  upload.fields([
    { name: "posters", maxCount: 5 },
    { name: "speakerPhotos", maxCount: 10 }
  ]),
  validateEvent,
  createEvent
);

router.get("/", getEvents);

export default router;
