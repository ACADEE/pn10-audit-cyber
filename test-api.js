import fetch from 'node-fetch';

async function test() {
  console.log("Testing GET /api/check...");
  try {
    const resCheck = await fetch('http://127.0.0.1:3000/api/check');
    const textCheck = await resCheck.text();
    console.log("Check Status:", resCheck.status, "Response:", textCheck);
  } catch(e) {
    console.error(e);
  }

  console.log("\nTesting POST /api/analyze...");
  try {
    const res = await fetch('http://127.0.0.1:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientData: { entreprise: "Test" },
        answers: {}
      })
    });
    
    const text = await res.text();
    console.log("Analyze Status:", res.status);
    console.log("Analyze Response Text:", text);
  } catch(e) {
    console.error("Fetch error:", e);
  }
}
test();
