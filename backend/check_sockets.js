const net = require('net');

const regions = [
  "eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3", "eu-north-1",
  "us-east-1", "us-east-2", "us-west-1", "us-west-2",
  "ap-southeast-1", "ap-southeast-2", "ap-south-1", "ap-northeast-1", "ap-northeast-2",
  "sa-east-1", "ca-central-1", "me-south-1", "af-south-1"
];

function pingHost(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2500);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function findLivePoolers() {
  console.log("Checking Supabase pooler reachability...");
  for (const r of regions) {
    const host = `aws-0-${r}.pooler.supabase.com`;
    const isLive = await pingHost(host, 6543);
    if (isLive) {
      console.log(`✅ Reachable Pooler: ${host} (Region: ${r})`);
    }
  }
}

findLivePoolers();
