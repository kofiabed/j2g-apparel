const { Client } = require('pg');

const testPasswords = [
  "J2gapparel@123$",
  "J2GAPPAREL",
  "J2gapparel123$",
  "J2gapparel@123",
  "J2gapparel123",
  "j2gapparel@123$",
  "j2gapparel123",
  "Admin123",
  "admin123"
];

async function testEuCentral1() {
  const host = "aws-0-eu-central-1.pooler.supabase.com";
  console.log(`Testing passwords on confirmed region: eu-central-1 (${host})...`);
  
  for (const pw of testPasswords) {
    const encoded = encodeURIComponent(pw);
    
    // Try transaction pooler (port 6543)
    const uri6543 = `postgresql://postgres.qxbqnjfydyzjhzgsxdsv:${encoded}@${host}:6543/postgres?pgbouncer=true`;
    try {
      const client = new Client({ connectionString: uri6543, connectionTimeoutMillis: 3000, ssl: { rejectUnauthorized: false } });
      await client.connect();
      console.log(`\n🎉 SUCCESS! Connected to Supabase with password: "${pw}"`);
      console.log(`Connection URI: ${uri6543}`);
      await client.end();
      return { pw, uri: uri6543 };
    } catch (err) {
      console.log(`PW "${pw}" -> ${err.message}`);
    }
  }
}

testEuCentral1();
