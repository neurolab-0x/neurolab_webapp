async function run() {
    const fetch = (await import('node-fetch')).default;

    try {
        const loginRes = await fetch("https://backend-neurolab.onrender.com/api/auth/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'kagame123@example.com', password: '12345678' })
        });
        const loginData = await loginRes.json();
        console.log("Token acquired", loginData.accessToken ? "yes" : "no");

        const uploadsRes = await fetch("https://backend-neurolab.onrender.com/api/uploads", {
            headers: { 'Authorization': `Bearer ${loginData.accessToken}` }
        });
        const uploadsData = await uploadsRes.json();
        console.log("Uploads schema:", JSON.stringify(uploadsData.uploads ? uploadsData.uploads[0] : uploadsData, null, 2));

    } catch (err) {
        console.log("Error", err);
    }
}

run();
