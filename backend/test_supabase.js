const url = "https://qxbqnjfydyzjhzgsxdsv.supabase.co/rest/v1";
const key = "sb_publishable_eI991QCgkbHAXnPf6Ajuig_vSOa1MiY";

async function testTables() {
  const tables = ["Product", "product", "products", "Category", "categories", "User", "users", "Order", "orders"];
  
  for (const table of tables) {
    try {
      const res = await fetch(`${url}/${table}?select=*`, {
        headers: {
          "apikey": key,
          "Authorization": `Bearer ${key}`
        }
      });
      const text = await res.text();
      console.log(`Table '${table}': HTTP ${res.status} -> ${text.slice(0, 100)}`);
    } catch (err) {
      console.error(`Error on ${table}:`, err.message);
    }
  }
}

testTables();
