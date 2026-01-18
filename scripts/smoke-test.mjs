import axios from 'axios';

const API_URL = process.env.VITE_API_URL || process.env.Backend_URL || process.env.API_URL || 'http://localhost:5000/';
const email = process.env.SMOKE_EMAIL;
const password = process.env.SMOKE_PASSWORD;

function exitWithHelp() {
  console.error('\nUsage: SMOKE_EMAIL=you@example.com SMOKE_PASSWORD=secret VITE_API_URL=https://... npm run smoke-test');
  process.exit(1);
}

if (!email || !password) {
  console.error('Missing credentials for smoke test.');
  exitWithHelp();
}

(async function run() {
  try {
    console.log('API_URL:', API_URL);

    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL.replace(/\/$/, '')}/auth/login`, {
      email,
      password,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const { accessToken } = loginRes.data;
    if (!accessToken) {
      console.error('Login did not return accessToken. Response:', loginRes.data);
      process.exit(1);
    }

    console.log('Login successful. Access token received. Running createAnalysis...');

    const payload = {
      deviceId: '123e4567-e89b-12d3-a456-426614174000',
      type: 'EEG',
      parameters: {
        samplingRate: 256,
        duration: 300,
        channels: ['Fp1', 'Fp2', 'C3', 'C4']
      }
    };

    const analysisRes = await axios.post(`${API_URL.replace(/\/$/, '')}/analysis`, payload, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
    });

    console.log('Analysis created successfully. Response:');
    console.log(JSON.stringify(analysisRes.data, null, 2));
  } catch (err) {
    const e = err;
    if (e.response) {
      console.error('Request failed:', e.response.status, e.response.statusText);
      try {
        console.error(JSON.stringify(e.response.data, null, 2));
      } catch {}
    } else {
      console.error('Error:', e.message || e);
    }
    process.exit(1);
  }
})();
