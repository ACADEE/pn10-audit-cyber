import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY, 
  httpOptions: { 
    headers: { 'Origin': 'https://diagnostic-cyber-acadee-444403853760.us-west1.run.app' }
  } 
});
ai.models.generateContent({
  model: 'gemini-2.5-pro',
  contents: 'ping',
}).then(res => console.log('SUCCESS:', res.text)).catch(e => console.error('FAIL:', e));
