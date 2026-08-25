const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function applySupabaseSql() {
  const sqlPath = path.join(__dirname, 'supabase_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const connectionString = "postgresql://postgres.qxbqnjfydyzjhzgsxdsv:J2gapparel%40123%24@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  
  console.log("Connecting to Supabase PostgreSQL at aws-0-eu-central-1.pooler.supabase.com...");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL successfully!");
    
    console.log("Executing DDL schema, tables creation, RLS policies, and seed data...");
    await client.query(sql);
    console.log("🎉 ALL TABLES AND PRODUCTS MIGRATED DIRECTLY TO SUPABASE!");
    
    const countRes = await client.query('SELECT COUNT(*) FROM "Product";');
    console.log(`Verified: ${countRes.rows[0].count} products active in Supabase!`);
  } catch (err) {
    console.error("Migration Error:", err);
  } finally {
    await client.end();
  }
}

applySupabaseSql();
