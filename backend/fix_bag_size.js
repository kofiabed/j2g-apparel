const { Client } = require('pg');

async function fixSize() {
  const client = new Client({
    connectionString: "postgresql://postgres.qxbqnjfydyzjhzgsxdsv:J2gapparel%40123%24@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    await client.query(`
      UPDATE "Product"
      SET "sizes" = '["Executive Large (14 x 10 x 5 in)"]'
      WHERE "sku" = 'BAG-NVY-011';
    `);
    console.log("Fixed BAG-NVY-011 sizes field in Supabase!");
  } catch (err) {
    console.error("Error fixing size:", err);
  } finally {
    await client.end();
  }
}

fixSize();
