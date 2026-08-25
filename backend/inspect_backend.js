async function inspectBackend() {
  try {
    const res = await fetch('http://127.0.0.1:5000/api/products');
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Response JSON:", json);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

inspectBackend();
