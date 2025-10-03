import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // login ID
  password: { type: String, required: true },             // hashed password
  walletId: { type: String, required: true },
  department: { type: String, required: true },
  yearOfPassing: { type: Number, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
