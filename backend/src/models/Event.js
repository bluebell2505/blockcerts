import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  createdBy: { type: String, required: true }, // admin id or name
  speakers: [
    {
      name: String,
      photoUrl: String   // speaker image URL
    }
  ],
  posters: [String],     // array of promo poster URLs
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
