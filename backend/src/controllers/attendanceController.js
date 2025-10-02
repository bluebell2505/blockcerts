import { verifyToken } from "../utils/crypto.js";
import Registration from "../models/Registration.js";
import Attendance from "../models/Attendance.js";

export const scanAttendance = async (req, res) => {
  try {
    const { qrToken } = req.body;
    const decoded = verifyToken(qrToken);
    if (!decoded) return res.status(400).json({ error: "Invalid QR token" });

    const { eventId, participantId, timestamp } = decoded;

    // find registration
    const reg = await Registration.findOne({ eventId, participantId, qrToken });
    if (!reg) return res.status(404).json({ error: "Registration not found" });

    if (reg.used) return res.status(400).json({ error: "Token already used" });
    if (new Date() > reg.tokenExpiry)
      return res.status(400).json({ error: "Token expired" });

    // mark attendance
    await Attendance.create({ eventId, participantId });
    reg.used = true;
    await reg.save();

    res.json({ message: "Attendance marked successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};