// PM2 process file. Start with: pm2 start ecosystem.config.cjs
//
// Other sites on the same server run their own Next.js apps, so each needs its
// own port. Pick a free one (check with: ss -ltnp | grep 127.0.0.1) and use the
// same number in the Apache proxy include (deploy/apache-aexon-proxy.conf).
const fs = require("fs");

const PORT = process.env.AEXON_PORT || 3100;

// When PM2 runs as root (WHM Terminal) and this folder belongs to the cPanel
// account, start the app as that account instead of root. A problem in the
// site then stays inside that one account.
const runAs = (() => {
  if (typeof process.getuid !== "function" || process.getuid() !== 0) return {};
  // PM2 looks the uid up in /etc/passwd and sets the group and HOME from it
  const { uid } = fs.statSync(__dirname);
  return uid === 0 ? {} : { uid };
})();

module.exports = {
  apps: [
    {
      name: "aexon-web",
      script: "node_modules/next/dist/bin/next",
      args: `start -p ${PORT} -H 127.0.0.1`,
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: { NODE_ENV: "production" },
      ...runAs,
    },
  ],
};
