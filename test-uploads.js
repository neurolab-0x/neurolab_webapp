async function run() {
    const loginRes = await fetch("https://backend-neurolab.onrender.com/api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test1@gmail.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const uploadsRes = await fetch("https://backend-neurolab.onrender.com/api/uploads", {
        headers: { 'Authorization': `Bearer ${loginData.accessToken}` }
    });
    const data = await uploadsRes.json();
    console.log("Uploads array length:", data.uploads?.length || data.length);
    if (data.uploads?.length > 0) {
        console.log("First upload:", JSON.stringify(data.uploads[0], null, 2));
    } else if (data.length > 0) {
        console.log("First upload:", JSON.stringify(data[0], null, 2));
    }
}
run();
