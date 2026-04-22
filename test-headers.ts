import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'referer': 'https://cyberdiag-pn10.netlify.app/'
    }
  }
});
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
