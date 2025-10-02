import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Current directory:', __dirname);
console.log('Loading .env from:', path.join(__dirname, '.env'));

// Try to load .env
dotenv.config();

console.log('PRIVATE_KEY exists:', !!process.env.PRIVATE_KEY);
console.log('ALCHEMY_URL exists:', !!process.env.ALCHEMY_URL);
console.log('CONTRACT_ADDRESS exists:', !!process.env.CONTRACT_ADDRESS);

if (process.env.PRIVATE_KEY) {
    console.log('PRIVATE_KEY starts with 0x:', process.env.PRIVATE_KEY.startsWith('0x'));
    console.log('PRIVATE_KEY length:', process.env.PRIVATE_KEY.length);
}