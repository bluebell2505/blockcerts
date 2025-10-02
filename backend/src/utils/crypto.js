import crypto from "crypto";
import { key_PRIVATE_KEY } from "../keys.js";

if (!key_PRIVATE_KEY) {
  throw new Error("❌ PRIVATE_KEY not found. Please set PRIVATE_KEY or PRIVATE_KEY_PATH in .env");
}

/**
 * Generate a signed QR token
 */
export const generateToken = (eventId, participantId) => {
  const timestamp = Date.now().toString();
  const payload = `${eventId}:${participantId}:${timestamp}`;
  const signature = crypto.createHmac("sha256", key_PRIVATE_KEY).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64");
};

/**
 * Verify token signature and return decoded data
 */
export const verifyToken = (token) => {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [eventId, participantId, timestamp, signature] = decoded.split(":");

    const computed = crypto
      .createHmac("sha256", key_PRIVATE_KEY)
      .update(`${eventId}:${participantId}:${timestamp}`)
      .digest("hex");

    if (computed !== signature) return null;
    return { eventId, participantId, timestamp };
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return null;
  }
};

// ✅ Important: explicit export
export default { generateToken, verifyToken };