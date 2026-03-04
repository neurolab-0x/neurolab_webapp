const fs = require('fs');

async function run() {
  const fetch = (await import('node-fetch')).default;
  const FormData = require('form-data');

  // Let's create a tiny dummy csv to upload
  fs.writeFileSync('dummy.csv', 'time,ch1,ch2\n1,0.5,0.6\n2,0.4,0.7\n');

  try {
    // 1. Login as doctor to get token
    console.log("Logging in...");
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'kagame123@example.com', password: '12345678' })
    });

    let loginData = await loginRes.json();

    if (!loginData.token) {
      console.error("Login completely failed", loginData);
      return;
    }

    console.log("Logged in successfully. Token length:", loginData.token.length);

    // 2. Try the analysis endpoint
    const form = new FormData();
    form.append('file', fs.createReadStream('dummy.csv'));

    console.log("Sending analysis request...");
    const analysisRes = await fetch('http://localhost:5000/api/analysis', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`
        // form-data handles boundary headers automatically in node
      },
      body: form
    });

    const analysisText = await analysisRes.text();
    console.log("Analysis Status:", analysisRes.status);
    try {
      console.log("Analysis Data:", JSON.stringify(JSON.parse(analysisText), null, 2));
    } catch (e) {
      console.log("Analysis Raw Text:", analysisText);
    }

  } catch (err) {
    console.error("Test failed", err);
  } finally {
    if (fs.existsSync('dummy.csv')) fs.unlinkSync('dummy.csv');
  }
}

run();
