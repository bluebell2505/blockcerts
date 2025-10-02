// Encryption key for QR token signing
export const key_PRIVATE_KEY = process.env.PRIVATE_KEY || 'dev-private-key-blockcerts-2024-secure-signing-key';

// You can also add other key exports if needed by other files
export const key_PUBLIC_KEY = process.env.PUBLIC_KEY || 'dev-public-key-blockcerts-2024';

// Default export for compatibility
export default {
  key_PRIVATE_KEY,
  key_PUBLIC_KEY
};