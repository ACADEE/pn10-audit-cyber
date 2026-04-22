import { createServer } from 'vite';
async function test() {
  console.log("Before vite:", process.env.GEMINI_API_KEY);
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  console.log("After vite:", process.env.GEMINI_API_KEY);
  process.exit(0);
}
test();
