import fetch from 'node-fetch';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

console.log("TEST-HEADERS: API Key Starts With:", process.env.GEMINI_API_KEY?.substring(0, 5));
console.log("TEST-HEADERS: API Key Length:", process.env.GEMINI_API_KEY?.length);

async function checkServerKey() {
  // Let's modify test-api.js to print the length from the server!
}
