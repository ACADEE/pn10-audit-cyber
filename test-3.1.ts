import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: 'ping',
    });
    console.log('SUCCESS:', response.text);
  } catch (e) {
    console.error('FAIL:', e.message);
  }
}
run();
