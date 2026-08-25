const net = require('net');

const regions = [
  "eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3", "eu-north-1",
  "us-east-1", "us-east-2", "us-west-1", "us-west-2",
  "ap-southeast-1", "ap-southeast-2", "ap-south-1", "ap-northeast-1", "ap-northeast-2",
  "sa-east-1", "ca-central-1", "me-south-1", "af-south-1"
];

const passwords = ["J2gapparel@123$", "J2GAPPAREL"];

async function checkPoolers() {
  const { Client } = require('pg');

  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    for (const pw of passwords) {
      const encodedPw = encodeURIComponent(pw);
      // Session mode port 5432
      const uri = `postgresql://postgres.qxbqnjfydyzjhzgsxdsv:${encodedPw}@${host}:5432/postgres`;
      const client = new Client({ connectionString: uri, connectionTimeoutMillis: 3000, ssl: { rejectUnauthorized: false } });
      try {
        await client.connect();
        console.log(`\n🎉 FOUND WORKING SUPABASE POOLER!`);
        console.log(`Region: ${region}`);
        console.log(`Host: ${host}`);
        console.log(`URI: ${uri}`);
        await client.end();
        return { region, host, uri };
      } catch (err) {
        if (err.message && (err.message.includes('password') || err.message.includes('tenant') || err.message.includes('database'))) {
          console.log(`Region ${region} responded: ${err.message}`);
        }
      }
    }
  }
  console.log("No pooler responded with success.");
}

checkPoolers();
