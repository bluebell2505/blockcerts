import Certificate from "../models/Certificate.js";
import Attendance from "../models/Attendance.js";

export const getAllCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find().populate("eventId participantId");
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Batch mint trigger → Person B’s service will handle actual mint
export const mintCertificates = async (req, res) => {
  try {
    const { eventId } = req.body;
    const attendees = await Attendance.find({ eventId });
    // TODO: call certService.batchMint(attendees)
    res.json({ message: "Mint process started", total: attendees.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
