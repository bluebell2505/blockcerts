import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  createdBy: { type: String, required: true }, // admin id or name
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
