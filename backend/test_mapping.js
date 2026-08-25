async function testMapping() {
  const res = await fetch('http://127.0.0.1:5000/api/products');
  const data = await res.json();
  console.log(`Fetched ${data.length} products from backend.`);
  
  try {
    const mapped = data.map((p, idx) => {
      try {
        const images = p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images) : [];
        const sizes = p.sizes ? (typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes) : [];
        const colors = p.colors ? (typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors) : [];
        return { name: p.name, imagesCount: images.length, sizes, colors };
      } catch (parseErr) {
        console.error(`❌ JSON.parse error on product #${idx} (${p.name}):`, parseErr.message);
        throw parseErr;
      }
    });
    console.log("✅ All products mapped successfully without parse errors!", mapped.length);
  } catch (err) {
    console.error("Mapping failed:", err);
  }
}

testMapping();
