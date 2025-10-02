import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Participant", required: true },
  certId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String },
  walletAddress: { type: String },
  ipfsHash: { type: String }, // Metadata hash
  imageHash: { type: String }, // Image hash
  imageUrl: { type: String },  // Image URL
  metadataUrl: { type: String }, // Metadata URL
  txHash: { type: String },
  issuedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Certificate", certificateSchema);