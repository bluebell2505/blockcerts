// backend/src/routes/registrations.js
import express from "express";
import { registerParticipant } from "../controllers/registrationController.js";
import { validateRegistration } from "../utils/validator.js";

const router = express.Router();

// POST /api/registrations/:eventId/register
router.post("/:eventId/register", validateRegistration, registerParticipant);

export default router;
