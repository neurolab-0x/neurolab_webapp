# Smoke test script

This repository includes a smoke-test script that logs in and attempts to create an analysis via the backend API.

Usage:

- Set the following environment variables and run the npm script:

  SMOKE_EMAIL=you@example.com SMOKE_PASSWORD=yourpassword VITE_API_URL=https://neurolab-backend-bgk4.onrender.com/api/ npm run smoke-test

- The script will:
  1. POST to `${API_URL}/auth/login` with your credentials
  2. Extract the access token from the response
  3. POST to `${API_URL}/analysis` with an example payload using the Bearer token

Notes:
- If login returns `401 Invalid credentials`, provide valid credentials or use the app UI to obtain a token.
- If the analysis request returns `500` or `502` (server error / bad gateway), that's an issue on the backend. Capture the full response and server logs and open an issue with the backend team.
- The script expects the API to be reachable and to respond with JSON error payloads. If you receive HTML (e.g., Render error pages), the backend may be experiencing an outage.
