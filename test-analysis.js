async function run() {
    try {
        const loginRes = await fetch("https://backend-neurolab.onrender.com/api/auth/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'kagame123@example.com', password: '12345678' })
        });
        const loginData = await loginRes.json();

        // 1. fetch cloudinary blob
        const fileRes = await fetch("https://res.cloudinary.com/dcl59ujhl/raw/upload/v1772520243/eeg_uploads/1772520242992-dummy_eeg.csv");
        const blob = await fileRes.blob();

        // 2. construct form data
        const formData = new FormData();
        formData.append('file', blob, 'dummy_eeg.csv');
        formData.append('sessionId', 'manual-analysis');

        // 3. send to analysis
        const analysisRes = await fetch("https://backend-neurolab.onrender.com/api/analysis", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${loginData.accessToken}`
            },
            body: formData
        });

        const text = await analysisRes.text();
        console.log("Analysis Status:", analysisRes.status);
        console.log("Analysis Response:", text);

    } catch (err) {
        console.log("Error", err);
    }
}
run();
