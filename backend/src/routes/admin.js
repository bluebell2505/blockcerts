import express from 'express';
import { getParticipants, markAttendance } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/participants', protect, adminOnly, getParticipants);
router.post('/attendance/:registrationId', protect, adminOnly, markAttendance);

export default router;
