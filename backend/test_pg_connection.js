const { Client } = require('pg');

const passwords = ["J2gapparel@123$", "J2GAPPAREL"];
const hosts = [
  "db.qxbqnjfydyzjhzgsxdsv.supabase.co",
  "aws-0-eu-central-1.pooler.supabase.com",
  "aws-0-us-east-1.pooler.supabase.com",
  "aws-0-eu-west-1.pooler.supabase.com",
  "aws-0-ap-southeast-1.pooler.supabase.com"
];

async function testConnections() {
  for (const pw of passwords) {
    const encodedPw = encodeURIComponent(pw);
    
    // Direct connection test
    const directUri = `postgresql://postgres:${encodedPw}@db.qxbqnjfydyzjhzgsxdsv.supabase.co:5432/postgres`;
    console.log(`Testing direct connection...`);
    try {
      const client = new Client({ connectionString: directUri, connectionTimeoutMillis: 5000, ssl: { rejectUnauthorized: false } });
      await client.connect();
      console.log(`SUCCESS with direct URI! Password worked.`);
      const res = await client.query('SELECT current_database(), version();');
      console.log(`Connected to:`, res.rows[0]);
      await client.end();
      return directUri;
    } catch (err) {
      console.log(`Direct connection failed: ${err.message}`);
    }

    // Pooler tests
    for (const host of hosts) {
      const poolerUri = `postgresql://postgres.qxbqnjfydyzjhzgsxdsv:${encodedPw}@${host}:6543/postgres?pgbouncer=true`;
      try {
        const client = new Client({ connectionString: poolerUri, connectionTimeoutMillis: 4000, ssl: { rejectUnauthorized: false } });
        await client.connect();
        console.log(`SUCCESS with pooler on ${host}!`);
        await client.end();
        return poolerUri;
      } catch (err) {
        // quiet
      }
    }
  }
  console.log("Could not establish connection with tested variations.");
}

testConnections();
