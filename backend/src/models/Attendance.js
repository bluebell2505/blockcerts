import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Participant", required: true },
  attendedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);